const { awscdk, DevEnvironmentDockerImage, Gitpod } = require('projen');

const AUTOMATION_TOKEN = 'PROJEN_GITHUB_TOKEN';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Pahud Hsieh',
  authorAddress: 'pahudnet@gmail.com',
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkConstructLibrary',
  name: 'cdk-kaniko',
  description: 'CDK construct library that allows you to build docker images with kaniko in AWS Fargate',
  repositoryUrl: 'https://github.com/pahud/cdk-kaniko.git',
  deps: ['cdk-fargate-run-task'],
  peerDeps: ['cdk-fargate-run-task'],
  devDeps: [
    '@aws-cdk/assert',
  ],
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      secret: AUTOMATION_TOKEN,
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['pahud'],
  },
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

project.package.addField('resolutions', {
  'pac-resolver': '^5.0.0',
  'set-value': '^4.0.1',
  'ansi-regex': '^5.0.1',
});


const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
// install and compile only, do not test or package.
gitpodPrebuild.exec('yarn install');
gitpodPrebuild.exec('npx projen compile');

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromImage('public.ecr.aws/pahudnet/gitpod-workspace:latest'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  init: 'yarn gitpod:prebuild',
  // always upgrade after init
  command: 'npx projen upgrade',
});

gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint',
  'ms-azuretools.vscode-docker',
  'AmazonWebServices.aws-toolkit-vscode',
);

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);

project.synth();

