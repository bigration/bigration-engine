import { Job, scheduleJob } from 'node-schedule';
import { getEngineId, getProducerChannel } from './amqp-client';
import {
  EngineRestartDTO,
  SendMeInstanceDTO,
} from '@bigration/studio-api-interface';

export const schedulers: Record<string, Job> = {};

export const requestSchedulers = (engineId: string) => {
  const engineRestartDTO: EngineRestartDTO = {
    region: engineId,
  };

  getProducerChannel().publish(
    getEngineId(),
    'update.engine-restart',
    Buffer.from(JSON.stringify(engineRestartDTO))
  );
};

export const addScheduler = (workflowId: string, cron: string) => {
  try {
    if (!cron) {
      removeScheduler(workflowId);
      return;
    }

    if (schedulers[workflowId]) {
      schedulers[workflowId].reschedule(cron);
    } else {
      schedulers[workflowId] = scheduleJob(cron, function () {
        const sendMeInstanceDTO: SendMeInstanceDTO = {
          workflowId: workflowId,
          triggeredBy: 'CRON_JOB',
        };
        getProducerChannel().publish(
          getEngineId(),
          'update.send-me-instance',
          Buffer.from(JSON.stringify(sendMeInstanceDTO))
        );
      });
    }
  } catch (error) {
    console.log(
      `Can Not Set Scheduler for workflowId ${workflowId} cron ${cron}`,
      error
    );
    removeScheduler(workflowId);
  }
};

// setInterval(() => {
//   logger.info(Object.keys(schedulers), 'Current schedulers');
// }, 2000);

const removeScheduler = (workflowId: string) => {
  const job = schedulers[workflowId];

  try {
    if (job) {
      job.cancel();
      delete schedulers[workflowId];
    }
  } catch (error) {
    console.log(`Can Not Remove Scheduler for instance ${workflowId}`, error);
  }
};
