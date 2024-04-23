import { INSTANCE_LOG_KEYS } from '../../constants';
import { InstanceActionModel } from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { getInstanceTempVarsWithValues } from '../../cache';
import { logEvent } from '../../logger';
import { inputValueParser } from '../../utils';
import { CustomWorkflowError } from '../../common';

export const consumerLoggerTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { logger } = config;

  if (!logger) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  if (logger.tempVariables) {
    const tempVars = await getInstanceTempVarsWithValues(instanceId);
    logEvent({
      instanceId,
      targetId,
      sourceId,
      logKey: INSTANCE_LOG_KEYS.INSTANCE_TEMP_VARIABLES,
      references: tempVars,
    });
  }

  if (logger.inputsRender && logger.inputsRender.length > 0) {
    const parsedInputs = logger.inputsRender.reduce(function (
      map: Record<string, unknown>,
      obj
    ) {
      map[obj.key] = inputValueParser(
        inputParameterValues,
        obj.value
      ).parsedValue;

      return map;
    },
    {});
    return {
      outputParameterValues: parsedInputs,
    };
  }

  return {
    outputParameterValues: {},
  };
};
