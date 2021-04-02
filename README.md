[![NPM version](https://badge.fury.io/js/cdk-kaniko.svg)](https://badge.fury.io/js/cdk-kaniko)
[![PyPI version](https://badge.fury.io/py/cdk-kaniko.svg)](https://badge.fury.io/py/cdk-kaniko)
[![Release](https://github.com/pahud/cdk-kaniko/actions/workflows/release.yml/badge.svg)](https://github.com/pahud/cdk-kaniko/actions/workflows/release.yml)

# `cdk-kaniko`

Build images with `kanilo` in **AWS Fargate**

# About

`cdk-kaniko` is a CDK construct library that allows you to build images with **kaniko** in **AWS Fargate**. Inspired from the blog post - [Building container images on Amazon ECS on AWS Fargate](https://aws.amazon.com/tw/blogs/containers/building-container-images-on-amazon-ecs-on-aws-fargate/) by _Re Alvarez-Parmar_ and _Olly Pomeroy_, this library aims to abstract away all the infrastructure provisioning and configuration with minimal IAM policies required and allow you to focus on the high level CDK constructs. Under the covers, `cdk-kaniko` leverages the [cdk-fargate-run-task](https://github.com/pahud/cdk-fargate-run-task) so you can build the image just once or schedule the building periodically.

# Sample

```ts
const app = new cdk.App();

const stack = new cdk.Stack(app, 'my-stack-dev');

const kaniko = new Kaniko(stack, 'KanikoDemo', {
  context: 'git://github.com/pahud/vscode.git',
  contextSubPath: './.devcontainer',
});

// build it once
kaniko.buildImage('once');

// schedule the build every day 0:00AM
kaniko.buildImage('everyday', Schedule.cron({
  minute: '0',
  hour: '0',
}));
```

# fargate spot support

Use `fargateSpot` to enable the `FARGATE_SPOT` capacity provider to provision the fargate tasks.

```ts
new Kaniko(stack, 'KanikoDemo', {
  context,
  contextSubPath,
  fargateSpot: true,
});
```

# Note

Please note the image building could take some minutes depending on the complexity of the provided `Dockerfile`. On deployment completed, you can check and tail the **AWS Fargate** task logs from the **AWS CloudWatch Logs** to view all the build output.
