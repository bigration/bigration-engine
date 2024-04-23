import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import { runInstance } from '../instance';
import { InstanceEngineMessageDTO } from '@bigration/studio-api-interface';
import { addScheduler } from './schedulers';
import { logger } from '../logger';

let producerChannel: Channel | null = null;

let engineIdSingleton: string;

export const getEngineId = (): string => {
  if (engineIdSingleton) {
    return engineIdSingleton;
  }

  const engineId = process.env['ENGINE_ID'];
  if (!engineId) {
    throw Error('No engine id provided, please provide ENGINE_ID');
  }
  engineIdSingleton = engineId;
  return engineId;
};

export function getProducerChannel(): Channel {
  if (!producerChannel) {
    throw Error('No producer channel initialized');
  }
  return producerChannel;
}

export async function initAmqpClient() {
  const engineId = getEngineId();
  const wfSecret = process.env['ENGINE_SECRET'];
  const amqpUrl =
    process.env['AMQP_URL'] || 'amqp.bigration.com:5672/workflow-engine';

  const connection: amqp.Connection = await amqp.connect(
    `amqp://${engineId}:${wfSecret}@${amqpUrl}`,
    { clientProperties: { connection_name: engineId } }
  );

  producerChannel = await connection.createChannel();

  const consumerChannel = await connection.createChannel();

  await consumerChannel.consume(engineId, async (msg) => {
    if (msg) {
      const messageContent = msg.content.toString();
      logger.debug(messageContent);

      const parsedMessage = JSON.parse(messageContent);

      const cronJobSet: Record<string, string> =
        parsedMessage['CRON_JOB_UPDATE'];

      const instanceRun: InstanceEngineMessageDTO | undefined =
        parsedMessage['INSTANCE_RUN'];

      if (cronJobSet) {
        logger.info(cronJobSet, 'CRON_JOB_UPDATE');

        Object.keys(cronJobSet).forEach((workflowId) => {
          addScheduler(workflowId, cronJobSet[workflowId]);
        });
      }

      if (instanceRun) {
        await runInstance(instanceRun);
      }
      consumerChannel.ack(msg);
    }
  });
}
