import {
  App, Stack,
  aws_events as events,
} from 'aws-cdk-lib';
import { Kaniko } from './';

export class IntegTesting {
  readonly stack: Stack[];
  constructor() {
    const app = new App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new Stack(app, 'my-stack-dev', { env });

    const kaniko = new Kaniko(stack, 'KanikoDemo', {
      context: 'git://github.com/pahud/vscode.git',
      contextSubPath: './.devcontainer',
      fargateSpot: true,
    });

    // build it once
    kaniko.buildImage('once');

    // schedule the build every day 0:00AM
    kaniko.buildImage('everyday', events.Schedule.cron({
      minute: '0',
      hour: '0',
    }));

    this.stack = [stack];
  }
}

new IntegTesting();
