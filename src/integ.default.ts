import { Schedule } from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { Kaniko } from './';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new cdk.Stack(app, 'my-stack-dev', { env });

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

    this.stack = [stack];
  }
}

new IntegTesting();
