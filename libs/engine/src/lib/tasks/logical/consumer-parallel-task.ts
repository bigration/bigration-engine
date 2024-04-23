import {
  InstanceActionModel,
  InstanceActionModelStatusEnum,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import {
  getInstanceRunFromCache,
  getInstanceTempActionVariablesFromCache,
  saveInstanceTempActionVariable,
} from '../../cache';

type ParallelTempVariableType = {
  sourceIds: Record<string, { arrived: boolean }>;
};

export const consumerParallelTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;

  if (!config?.parallel) {
    throw Error('Parallel config is missing');
  }
  const { parallel } = config;

  const cachedVariables: ParallelTempVariableType | undefined =
    await getInstanceTempActionVariablesFromCache<ParallelTempVariableType>({
      instanceId,
      instanceActionId: instanceAction.id as string,
    });

  const tempVariables: ParallelTempVariableType =
    cachedVariables ||
    (await getActionsWithTargetIncomingFlow({ targetId, instanceId }));

  if (!tempVariables.sourceIds[sourceId]) {
    throw Error(`Could not find sourceId ${sourceId} in tempVariables`);
  }

  const updatedTempVariables = {
    ...tempVariables,
    sourceIds: {
      ...tempVariables.sourceIds,
      [sourceId]: { ...tempVariables.sourceIds[sourceId], arrived: true },
    },
  };
  await saveInstanceTempActionVariable({
    instanceId,
    instanceActionId: instanceAction.id as string,
    value: updatedTempVariables,
  });

  // not all arrived
  const isThereSomeActionsThatNotArrived = Object.values(
    updatedTempVariables.sourceIds
  ).some((source) => !source.arrived);

  if (parallel.waitAll && isThereSomeActionsThatNotArrived) {
    return {
      outputParameterValues: updatedTempVariables,
      keepInstanceRunningSkipOutgoing: true,
      changeActionStatus: InstanceActionModelStatusEnum.RUNNING,
    };
  }
  // Exit
  return {
    outputParameterValues: updatedTempVariables,
  };
};

export async function getActionsWithTargetIncomingFlow({
  targetId,
  instanceId,
}: {
  targetId: string;
  instanceId: string;
}): Promise<ParallelTempVariableType> {
  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );

  const instanceActions: Array<InstanceActionModel | undefined> = Object.values(
    instanceCache.instanceActions
  ).filter((instanceAction) => {
    return instanceAction?.action?.outgoingFlows
      ?.map((flow) => flow.targetId)
      ?.includes(targetId);
  });

  if (!instanceActions || instanceActions.length === 0) {
    throw Error(
      `No incoming flows found for action ${targetId} in instance ${instanceId}`
    );
  }

  const flows: Record<string, { arrived: boolean }> = instanceActions.reduce(
    (acc: Record<string, { arrived: boolean }>, instanceAction) => {
      const data = instanceAction?.action;
      if (data?.id) {
        acc[data.id] = {
          arrived: false,
        };
      }
      return acc;
    },
    {}
  );

  return {
    sourceIds: flows,
  };
}
