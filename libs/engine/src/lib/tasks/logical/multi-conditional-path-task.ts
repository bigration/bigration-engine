import { INSTANCE_LOG_KEYS } from '../../constants';
import { getExpressionResult, isAPathValid } from './conditional-helpers';
import {
  ConditionalPathAction,
  FlowSourceTypeEnum,
  InstanceActionModel,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { CustomWorkflowError } from '../../common';
import { logEvent } from '../../logger';

export const multiConditionalPathTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { multiConditionalPath } = config;

  if (
    !multiConditionalPath ||
    Object.keys(multiConditionalPath.flowHandleConditionalPath).length === 0
  ) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }
  // TODO BROKEN DOES NOT LOOP THROUGH ALL PATHS
  for (const flowHandle in multiConditionalPath.flowHandleConditionalPath) {
    const conditionalPath: ConditionalPathAction | undefined =
      multiConditionalPath.flowHandleConditionalPath[flowHandle];

    if (!conditionalPath?.groups) {
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

      const outgoingFlow = instanceAction.action.outgoingFlows.filter(
        (flow) =>
          flow.sourceHandle == flowHandle &&
          flow.sourceType === FlowSourceTypeEnum.MULTI_CONDITIONAL_PATH
      );

      return {
        outputParameterValues: {},
        overriddenOutgoingFlows: outgoingFlow,
      };
    }

    return {
      outputParameterValues: {},
      keepInstanceRunningSkipOutgoing: true,
    };
  }
  return {
    outputParameterValues: {},
  };
};
