import * as cdk from 'aws-cdk-lib';
import { Kaniko } from '../src';

test('minimal usage', () => {
  // GIVEN
  const app = new cdk.App();

  const env = {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT || '123456789',
  };

  const stack = new cdk.Stack(app, 'my-stack-dev', { env });
  // WHEN
  const kaniko = new Kaniko(stack, 'KanikoDemo', {
    context: 'git://github.com/pahud/vscode.git',
    contextSubPath: './.devcontainer',
  });

  kaniko.buildImage('once');

  // THEN
  const t = cdk.assertions.Template.fromStack(stack);
  // should match snapshot
  expect(t).toMatchSnapshot();
  // should have a task definition
  t.resourceCountIs('AWS::ECS::TaskDefinition', 1);
  // and it should look like this
  t.hasResourceProperties('AWS::ECS::TaskDefinition', {
    ContainerDefinitions: [
      {
        Command: [
          '--context',
          'git://github.com/pahud/vscode.git',
          '--context-sub-path',
          './.devcontainer',
          '--dockerfile',
          'Dockerfile',
          '--destination',
          {
            'Fn::Join': [
              '',
              [
                {
                  'Fn::Select': [
                    4,
                    {
                      'Fn::Split': [
                        ':',
                        {
                          'Fn::GetAtt': [
                            'KanikoDemoRepoE4811266',
                            'Arn',
                          ],
                        },
                      ],
                    },
                  ],
                },
                '.dkr.ecr.',
                {
                  'Fn::Select': [
                    3,
                    {
                      'Fn::Split': [
                        ':',
                        {
                          'Fn::GetAtt': [
                            'KanikoDemoRepoE4811266',
                            'Arn',
                          ],
                        },
                      ],
                    },
                  ],
                },
                '.',
                {
                  Ref: 'AWS::URLSuffix',
                },
                '/',
                {
                  Ref: 'KanikoDemoRepoE4811266',
                },
              ],
            ],
          },
          '--force',
        ],
        Essential: true,
        Image: {
          'Fn::Sub': '123456789.dkr.ecr.us-east-1.${AWS::URLSuffix}/cdk-hnb659fds-container-assets-123456789-us-east-1:f5edb4c146c3b4314f65a98735fb11ab5ee24ecf5a9672095b008fde67868f8d',
        },
        LogConfiguration: {
          LogDriver: 'awslogs',
          Options: {
            'awslogs-group': {
              Ref: 'KanikoDemoBuildImageTaskkanikoLogGroup4C2A8704',
            },
            'awslogs-stream-prefix': 'kaniko',
            'awslogs-region': 'us-east-1',
          },
        },
        Name: 'kaniko',
      },
    ],
    Cpu: '512',
    ExecutionRoleArn: {
      'Fn::GetAtt': [
        'KanikoDemoBuildImageTaskExecutionRoleB24935D9',
        'Arn',
      ],
    },
    Family: 'mystackdevKanikoDemoBuildImageTaskB3BE4585',
    Memory: '1024',
    NetworkMode: 'awsvpc',
    RequiresCompatibilities: [
      'FARGATE',
    ],
    TaskRoleArn: {
      'Fn::GetAtt': [
        'KanikoDemoBuildImageTaskTaskRole84C9326D',
        'Arn',
      ],
    },
  });
});
