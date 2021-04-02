import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import { Schedule } from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { RunTask } from 'cdk-fargate-run-task';

export interface KanikoProps {
  /**
   * Kaniko build context.
   * @see https://github.com/GoogleContainerTools/kaniko#kaniko-build-contexts
   */
  readonly context: string;
  /**
   * The target ECR repository
   * @default - create a new ECR private repository
   */
  readonly destinationRepository?: ecr.IRepository;
  /**
   * The context sub path
   *
   * @defautl - current directory
   */
  readonly contextSubPath?: string;
  /**
   * The Dockerfile for the image building
   *
   * @default Dockerfile
   */
  readonly dockerfile?: string;
}

export class Kaniko extends cdk.Construct {
  readonly destinationRepository: ecr.IRepository
  readonly cluster: ecs.ICluster;
  readonly task: ecs.FargateTaskDefinition;
  constructor(scope: cdk.Construct, id: string, props: KanikoProps) {
    super(scope, id);

    const vpc = getOrCreateVpc(this);
    this.cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    this.destinationRepository = props.destinationRepository ?? this._createDestinationRepository();

    const executorImage = ecs.ContainerImage.fromAsset(path.join(__dirname, '../docker.d'));

    this.task = new ecs.FargateTaskDefinition(this, 'BuildImageTask', {
      cpu: 512,
      memoryLimitMiB: 1024,
    });
    this.task.addContainer('kaniko', {
      image: executorImage,
      command: [
        '--context', props.context,
        '--context-sub-path', props.contextSubPath ?? './',
        '--dockerfile', props.dockerfile ?? 'Dockerfile',
        '--destination', this.destinationRepository.repositoryUri,
        '--force',
      ],
      logging: new ecs.AwsLogDriver({ streamPrefix: 'kaniko' }),
    });

    this.destinationRepository.grantPullPush(this.task.taskRole);

    new cdk.CfnOutput(this, 'Repository', {
      value: this.destinationRepository.repositoryName,
    });


  }
  private _createDestinationRepository(): ecr.Repository {
    return new ecr.Repository(this, 'Repo', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
  /**
   * Build the image with kaniko.
   * @param schedule The schedule to repeatedly build the image
   */
  public buildImage(id: string, schedule?: Schedule) {
    // run it just once
    new RunTask(this, `BuildImage${id}`, {
      task: this.task,
      cluster: this.cluster,
      schedule,
    });
  }
}

function getOrCreateVpc(scope: cdk.Construct): ec2.IVpc {
  // use an existing vpc or create a new one
  return scope.node.tryGetContext('use_default_vpc') === '1'
    || process.env.CDK_USE_DEFAULT_VPC === '1' ? ec2.Vpc.fromLookup(scope, 'Vpc', { isDefault: true }) :
    scope.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(scope, 'Vpc', { vpcId: scope.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(scope, 'Vpc', { maxAzs: 3, natGateways: 1 });
}
