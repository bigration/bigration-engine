import {
  type GlobalVariableDTO,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';
import { getEngineCache } from './cache-instance';
import { CustomWorkflowError } from '../common';
import { INSTANCE_LOG_KEYS } from '../constants';
import { saveInstanceUpdate } from '../utils/workflow-engine-rest-client';

const STATISTICS_PREFIX = 'statistics';
const INSTANCE_PREFIX = 'instance';

type PrefixTypes = typeof STATISTICS_PREFIX | typeof INSTANCE_PREFIX;

type InstanceCache = {
  startTime: [number, number];
} & InstanceEngineMessageDTO;

export async function initNewInstanceRunCache(
  websocketMessage: InstanceEngineMessageDTO | InstanceCache
) {
  await getEngineCache().set(
    constructKey(INSTANCE_PREFIX, websocketMessage.instance.id),
    {
      ...websocketMessage,
      startTime: process.hrtime(),
    }
  );
}

export async function getInstanceRunFromCache<T>(
  prefix: PrefixTypes,
  instanceId: string
) {
  const newVar = await getEngineCache().get<T>(
    constructKey(prefix, instanceId)
  );
  if (!newVar) {
    throw new Error(`Instance ${instanceId} not found in cache`);
  }
  return newVar;
}

export async function updateInstanceActionOutputParams(
  instanceId: string,
  actionId: string,
  outputParams: unknown
) {
  const instance = await getInstanceRunFromCache<InstanceCache>(
    'instance',
    instanceId
  );
  const instanceAction = instance.instanceActions[actionId];
  if (instanceAction) {
    instanceAction.outputValues = outputParams as object;
    instance.instanceActions[actionId] = instanceAction;
    await initNewInstanceRunCache(instance);
  } else {
    throw new CustomWorkflowError({
      raw: `Instance action ${actionId} not found`,
      logKey: INSTANCE_LOG_KEYS.UNKNOWN,
      references: outputParams as object,
    });
  }
}

export const updateGlobalVariables = async (
  instanceId: string,
  globalVariables: Record<string, GlobalVariableDTO>
) => {
  const instance = await getInstanceRunFromCache<InstanceCache>(
    'instance',
    instanceId
  );

  instance.instance.globalVariables = {
    ...instance.instance.globalVariables,
    ...globalVariables,
  };

  saveInstanceUpdate({
    instanceId,
    globalVariables,
  });
};
const constructKey = (prefix: PrefixTypes, instanceId: string) => {
  if (!instanceId) {
    throw new Error('instanceId is required for cache key');
  }
  return `${prefix}:${instanceId}`;
};

export async function clearAndFlushInstanceAndStatistics(instanceId: string) {
  const instance = await getInstanceRunFromCache<InstanceCache>(
    INSTANCE_PREFIX,
    instanceId
  );
  const endTime: [number, number] = process.hrtime(instance.startTime); // Get the end time
  const executionTime: number = endTime[0] * 1000 + endTime[1] / 1000000; // Calculate the execution time in milliseconds

  saveInstanceUpdate({
    instanceId,
    executionTime,
  });
  await getEngineCache().del(constructKey(INSTANCE_PREFIX, instanceId));
}
