import { SynthUtils } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
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

  kaniko.buildImage();

  // THEN
  expect(SynthUtils.synthesize(stack).template).toMatchSnapshot();

  expect(stack).toHaveResourceLike('AWS::ECS::TaskDefinition', {
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
          'Fn::Join': [
            '',
            [
              '123456789.dkr.ecr.us-east-1.',
              {
                Ref: 'AWS::URLSuffix',
              },
              '/aws-cdk/assets:bf2b11b25023153b3132fb168f1c88158a590de5b651069f9fd8f4661e997dd7',
            ],
          ],
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
