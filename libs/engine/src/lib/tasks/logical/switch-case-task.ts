import { INSTANCE_LOG_KEYS } from '../../constants';
import {
  FlowSourceTypeEnum,
  InstanceActionModel,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { CustomWorkflowError } from '../../common';
import { inputValueParser } from '../../utils';
import { logEvent } from '../../logger';

export const switchCaseTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { switchCase } = config;

  if (
    !switchCase ||
    !switchCase.key ||
    Object.keys(switchCase.cases).length === 0
  ) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const parsedKey = inputValueParser(inputParameterValues, switchCase.key);

  for (const flowHandle in switchCase.cases) {
    const parsedValue = inputValueParser(
      inputParameterValues,
      switchCase.cases[flowHandle]
    );

    if (parsedValue.parsedValue === parsedKey.parsedValue) {
      logEvent({
        instanceId,
        sourceId,
        targetId: targetId,
        logKey: INSTANCE_LOG_KEYS.SWITCH_CASE_MATCH_FOUND,
        logVars: {
          key: parsedKey,
          value: parsedValue,
          path: flowHandle,
        },
      });

      const outgoingFlow = instanceAction.action.outgoingFlows.filter(
        (flow) =>
          flow.sourceHandle == flowHandle &&
          flow.sourceType === FlowSourceTypeEnum.SWITCH
      );

      return {
        outputParameterValues: {
          match: parsedValue,
        },
        overriddenOutgoingFlows: outgoingFlow,
      };
    }
  }

  logEvent({
    instanceId,
    sourceId,
    targetId: targetId,
    logKey: INSTANCE_LOG_KEYS.SWITCH_CASE_NO_MATCH_FOUND,
    logVars: {
      path: switchCase.defaultPath || '',
    },
  });

  const outgoingFlow = instanceAction.action.outgoingFlows.filter(
    (flow) =>
      flow.sourceHandle == switchCase.defaultPath &&
      flow.sourceType === FlowSourceTypeEnum.SWITCH
  );

  return {
    outputParameterValues: {},
    overriddenOutgoingFlows: outgoingFlow,
    keepInstanceRunningSkipOutgoing: outgoingFlow.length === 0,
  };
};
