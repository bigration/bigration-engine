import {
  InstanceActionModel,
  InstanceActionModelStatusEnum,
  InstanceActionUpdateWebsocketDTO,
} from '@bigration/studio-api-interface';

import { INSTANCE_LOG_KEYS } from '../constants';
import { HandleActionResponseType, MessageActionFlowType } from '../types';
import { logEvent } from '../logger';
import { saveInstanceActionUpdate } from '../utils/workflow-engine-rest-client';

export const updateAndNotifyActionStatusChange = async (
  startTime: [number, number],
  messageAction: MessageActionFlowType,
  status: InstanceActionModelStatusEnum,
  instanceAction: InstanceActionModel,
  actionResults?: HandleActionResponseType
) => {
  if (!instanceAction) {
    return;
  }

  const { instanceId, targetId, sourceId } = messageAction;

  const endTime: [number, number] = process.hrtime(startTime); // Get the end time
  const executionTime: number = endTime[0] * 1000 + endTime[1] / 1000000; // Calculate the execution time in milliseconds

  logEvent({
    instanceId,
    targetId,
    sourceId,
    logKey: INSTANCE_LOG_KEYS.ACTION_STATUS_CHANGE,
    logVars: {
      status,
      executionTime,
    },
  });

  const instanceActionUpdate: InstanceActionUpdateWebsocketDTO = {
    instanceId,
    actionId: instanceAction.id as string,
    status,
    executionTime,
    outputValues: actionResults?.outputParameterValues,
  };

  saveInstanceActionUpdate(instanceActionUpdate);
};
