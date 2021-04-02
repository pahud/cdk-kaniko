const { AwsCdkConstructLibrary } = require('projen');
const { Automation } = require('projen-automate-it');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '1.96.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-kaniko',
  description: 'CDK construct library that allows you to build docker images with kaniko in AWS Fargate',
  repositoryUrl: 'https://github.com/pahud/cdk-kaniko.git',
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-ecr',
    '@aws-cdk/aws-ecs',
    '@aws-cdk/aws-events',
  ],
  deps: ['cdk-fargate-run-task'],
  peerDeps: ['cdk-fargate-run-task'],
  dependabot: false,
  publishToPypi: {
    distName: 'cdk-kaniko',
    module: 'cdk_kaniko',
  },
  keywords: [
    'kaniko',
    'cdk',
    'fargate',
    'aws',
  ],
});

const automation = new Automation(project, {
  automationToken: AUTOMATION_TOKEN,
});

automation.projenYarnUpgrade();

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();

