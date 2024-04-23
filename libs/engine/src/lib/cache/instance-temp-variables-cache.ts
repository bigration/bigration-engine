import { InstanceUpdateWebsocketDTO } from '@bigration/studio-api-interface';
import { getEngineCache } from './cache-instance';
import { logger } from '../logger';
import { saveInstanceUpdate } from '../utils/workflow-engine-rest-client';

const PREFIX = 'instance-temp-action-vars';

type InstanceIdInstanceActionId = {
  instanceId: string;
  instanceActionId: string;
};

export async function getInstanceTempActionVariablesFromCache<T>({
  instanceId,
  instanceActionId,
}: InstanceIdInstanceActionId): Promise<T | undefined> {
  return await getEngineCache().get<T>(
    constructInstanceActionKey(instanceId, instanceActionId)
  );
}

// // TODO place it later in handle-instance, not used yet
// export async function initTempVariablesFromInstance(instance: InstanceModel) {
//
//
//   const tempVariablesFromInstance = instance.tempVariables;
//
//   logger.debug({ tempVariablesFromInstance: tempVariablesFromInstance });
//
//   if (
//     tempVariablesFromInstance &&
//     Object.keys(tempVariablesFromInstance).length > 0
//   ) {
//     await cache.mset(tempVariablesFromInstance);
//   }
// }

export async function saveInstanceTempActionVariable({
  instanceId,
  instanceActionId,
  value,
}: InstanceIdInstanceActionId & {
  value: unknown;
}) {
  await getEngineCache().set(
    constructInstanceActionKey(instanceId, instanceActionId),
    value
  );
}

async function getTempVarKeys(instanceId: string) {
  const keys = (await getEngineCache().store.keys()).filter((key: string) => {
    return key.startsWith(`${PREFIX}:${instanceId}:`);
  });

  return keys.map((key: string) => {
    const splitKey = key.split(':');
    const instanceId = splitKey[1];
    const instanceActionId = splitKey[2];
    return constructInstanceActionKey(instanceId, instanceActionId);
  });
}

export async function getInstanceTempVarsWithValues(
  instanceId: string
): Promise<Record<string, unknown>> {
  const keys = await getTempVarKeys(instanceId);

  if (!keys || keys.length === 0) {
    return {};
  }

  const values = await getEngineCache().store.mget(...keys);

  return keys.reduce((result: Record<string, unknown>, key: string, index) => {
    const value = values[index];
    if (value) {
      result[key] = value;
    }
    return result;
  }, {});
}

export async function deleteAllInstanceTempActionVariablesAndFlushThemToDb(
  instanceId: string
) {
  const keysToDelete = await getTempVarKeys(instanceId);

  logger.debug({ keysToDelete: keysToDelete });
  if (keysToDelete.length > 0) {
    const values = await getEngineCache().store.mget(...keysToDelete);

    const tempVarsWithValues: Record<string, string> = keysToDelete.reduce(
      (result: Record<string, string>, key: string, index: number) => {
        const value = values[index];
        if (value && typeof value === 'string') {
          result[key] = value;
        }
        return result;
      },
      {}
    );

    logger.debug({ tempVarsWithValues: tempVarsWithValues });

    const instanceUpdate: InstanceUpdateWebsocketDTO = {
      instanceId: instanceId,
      tempVariables: tempVarsWithValues as unknown as {
        [key: string]: object | undefined;
      },
    };
    saveInstanceUpdate(instanceUpdate);

    await getEngineCache().store.mdel(...keysToDelete);
  }
}

const constructInstanceActionKey = (
  instanceId: string,
  instanceActionId: string
) => {
  if (!instanceId) {
    throw new Error('instanceId is required for cache key');
  }
  if (!instanceActionId) {
    throw new Error('instanceActionId is required for cache key');
  }
  return `${PREFIX}:${instanceId}:${instanceActionId}`;
};
