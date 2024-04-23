import { updateAndNotifyActionStatusChange } from './update-and-notify-action-status-change';
import {
  ActionModelTypeEnum,
  Flow,
  FlowSourceHandleEnum,
  InstanceActionModelStatusEnum,
  InstanceEngineMessageDTO,
  InstanceLogModelTypeEnum,
  InstanceModelStatusEnum,
} from '@bigration/studio-api-interface';
import { updateAndNotifyInstanceStatusChangeDeleteCache } from './update-and-notify-instance-status-change';
import { notifyOutgoingFlow } from './notify-outgoing-flow';
import { handleError, handlerActionError } from './error-handlers';
import { ACTIONS_TYPE_HANDLES } from '../constants';

import { INSTANCE_LOG_KEYS } from '../constants';
import { getInstanceRunFromCache } from '../cache';
import { HandleActionType, MessageActionFlowType } from '../types';
import { logEvent, logger } from '../logger';
import {
  CustomWorkflowError,
  saveInstanceActionOutputParameters,
  handleInputParameters,
} from '../common';
import { incrementStatusPutIntoQueue } from '../common/execute-update-stats';

export async function processAction(messageAction: MessageActionFlowType) {
  const { instanceId, targetId, sourceId } = messageAction;

  try {
    const startTime: [number, number] = process.hrtime(); // Get the start time

    await processActionMainProcess(messageAction, startTime);
  } catch (error) {
    await handleError(messageAction);

    if (error instanceof CustomWorkflowError) {
      const fullError = error.fullError;

      logEvent({
        instanceId,
        targetId,
        sourceId,
        logKey: fullError.logKey,
        raw: fullError.raw ? fullError.raw.toString() : '',
        logVars: fullError.logVars,
        references: fullError.references,
        type: InstanceLogModelTypeEnum.ERROR,
      });
    } else {
      logger.error(error);

      logEvent({
        instanceId,
        targetId,
        sourceId,
        logKey: INSTANCE_LOG_KEYS.UNKNOWN,
        raw: error ? error.toString() : '',
        type: InstanceLogModelTypeEnum.ERROR,
      });
    }
  }
}

const getActionHandler = (
  actionType: ActionModelTypeEnum
): HandleActionType => {
  const handleAction = ACTIONS_TYPE_HANDLES[actionType];

  if (!handleAction) {
    throw Error(`Action type is not implemented yet ${actionType}`);
  }
  return handleAction;
};

const processActionMainProcess = async (
  messageAction: MessageActionFlowType,
  startTime: [number, number]
) => {
  const { actionType } = messageAction;

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    messageAction.instanceId
  );

  incrementStatusPutIntoQueue(
    instanceCache.calculatedAccountStatistic.id,
    messageAction.instanceId
  );

  const instanceAction = instanceCache.instanceActions[messageAction.targetId];

  if (!instanceAction) {
    throw Error(
      `Instance action not found for action ${messageAction.targetId}`
    );
  }
  try {
    const inputParameterValues: Record<string, unknown> =
      await handleInputParameters(messageAction, instanceAction);

    const actionHandler = getActionHandler(actionType);

    const actionResults = await actionHandler(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    const outgoingFlows: Array<Flow> = [];

    if (
      actionResults?.overriddenOutgoingFlows?.length &&
      actionResults?.overriddenOutgoingFlows?.length > 0
    ) {
      outgoingFlows.push(...actionResults.overriddenOutgoingFlows);
    } else if (instanceAction?.action?.outgoingFlows?.length > 0) {
      outgoingFlows.push(
        ...instanceAction.action.outgoingFlows.filter(
          (flow) => flow.sourceHandle === FlowSourceHandleEnum.A
        )
      );
    }

    await saveInstanceActionOutputParameters(
      messageAction,
      actionResults.outputParameterValues,
      instanceAction
    );

    if (actionResults.stopInstance) {
      await handleOutgoingFlowOrFinishInstanceRun(messageAction, []);
    } else if (!actionResults.keepInstanceRunningSkipOutgoing) {
      await handleOutgoingFlowOrFinishInstanceRun(messageAction, outgoingFlows);
    }

    await updateAndNotifyActionStatusChange(
      startTime,
      messageAction,
      actionResults.changeActionStatus ||
        InstanceActionModelStatusEnum.FINISHED,
      instanceAction,
      actionResults
    );
  } catch (error) {
    logger.error(error);
    await handlerActionError(startTime, messageAction, instanceAction);
    throw error;
  }
};

async function handleOutgoingFlowOrFinishInstanceRun(
  messageAction: MessageActionFlowType,
  outgoingFlows: Array<Flow>
) {
  if (outgoingFlows.length > 0) {
    outgoingFlows.forEach(({ targetId, targetType }) =>
      notifyOutgoingFlow({
        ...messageAction,
        targetId: targetId,
        actionType: targetType,
      })
    );
  } else {
    await updateAndNotifyInstanceStatusChangeDeleteCache({
      ...messageAction,
      status: InstanceModelStatusEnum.FINISHED,
    });
  }
}
