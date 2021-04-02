import { Schedule } from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import { Kaniko } from './';

export class IntegTesting {
  readonly stack: cdk.Stack[];
  constructor() {
    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'my-stack-dev');

    const kaniko = new Kaniko(stack, 'KanikoDemo', {
      context: 'git://github.com/pahud/vscode.git',
      contextSubPath: './.devcontainer',
    });

    // build it once
    kaniko.buildImage();

    // schedule the build every day 0:00AM
    kaniko.buildImage(Schedule.cron({
      minute: '0',
      hour: '0',
    }));

    this.stack = [stack];
  }
}

new IntegTesting();
