import {
  FlowSourceTypeEnum,
  InstanceActionModel,
} from '@bigration/studio-api-interface';
import { getExpressionResult, isAPathValid } from './conditional-helpers';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { CustomWorkflowError } from '../../common';
import { logEvent } from '../../logger';

export const consumerConditionalPathTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { conditionalPath } = config;

  if (!conditionalPath?.groups || !conditionalPath.groups.length) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const expressionResults = getExpressionResult(
    conditionalPath.groups,
    inputParameterValues,
    instanceId,
    sourceId,
    targetId
  );

  if (isAPathValid(conditionalPath.type, expressionResults)) {
    logEvent({
      instanceId,
      sourceId,
      targetId: targetId,
      logKey: INSTANCE_LOG_KEYS.CONDITIONAL_PATH_PATH_IS_VALID,
    });

    const outgoingFlowsFromA = instanceAction.action.outgoingFlows.filter(
      (flow) =>
        flow.sourceHandle == 'A' &&
        flow.sourceType === FlowSourceTypeEnum.CONDITIONAL_PATH
    );

    if (outgoingFlowsFromA?.length > 0) {
      return {
        outputParameterValues: {
          valid: true,
        },
        overriddenOutgoingFlows: outgoingFlowsFromA,
      };
    } else {
      return {
        outputParameterValues: {
          valid: true,
        },
        stopInstance: true,
      };
    }
  }

  // INVALID PATH

  logEvent({
    instanceId,
    sourceId,
    targetId: targetId,
    logKey: INSTANCE_LOG_KEYS.CONDITIONAL_PATH_PATH_IS_NOT_VALID,
    type: 'WARNING',
  });

  const outgoingFlowsB = instanceAction.action.outgoingFlows.filter(
    (flow) =>
      flow.sourceHandle == 'B' &&
      flow.sourceType === FlowSourceTypeEnum.CONDITIONAL_PATH
  );

  if (outgoingFlowsB?.length > 0) {
    return {
      outputParameterValues: {
        valid: false,
      },
      overriddenOutgoingFlows: outgoingFlowsB,
    };
  } else {
    return {
      outputParameterValues: {
        valid: false,
      },
      stopInstance: true,
    };
  }
};
