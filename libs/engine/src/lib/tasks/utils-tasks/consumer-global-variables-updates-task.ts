import {
  type GlobalVariableDTO,
  GlobalVariableToUpdate,
  InstanceActionModel,
  InstanceEngineMessageDTO,
  InstanceLogModelTypeEnum,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { getInstanceRunFromCache, updateGlobalVariables } from '../../cache';
import {
  getSingleValueFromParseResult,
  inputValueParser,
  ParseResults,
  parseString,
} from '../../utils';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { logEvent } from '../../logger';
import { add, concat, merge } from 'lodash';
import { CustomWorkflowError } from '../../common';

function getNewValue(
  requested: GlobalVariableToUpdate,
  currentValue: ParseResults | undefined,
  valueForUpdate: ParseResults
) {
  switch (requested?.action) {
    case 'ADD':
      if (!currentValue?.parsedValue) {
        return getSingleValueFromParseResult(valueForUpdate);
      }

      if (currentValue.array) {
        return concat(
          currentValue.array,
          getSingleValueFromParseResult(valueForUpdate)
        );
      }

      if (currentValue.object) {
        return merge(
          currentValue.object,
          getSingleValueFromParseResult(valueForUpdate)
        );
      }

      if (
        currentValue.number !== undefined &&
        valueForUpdate.number !== undefined
      ) {
        return add(currentValue.number, valueForUpdate.number);
      }

      if (valueForUpdate.parsedValue) {
        return concat(currentValue.parsedValue, valueForUpdate.parsedValue);
      }

      return currentValue.parsedValue;
    case 'REPLACE':
      return getSingleValueFromParseResult(valueForUpdate);

    default:
      return undefined;
  }
}

function logErrorEmptyVar(
  instanceId: string,
  targetId: string,
  sourceId: string,
  requested: GlobalVariableToUpdate
) {
  logEvent({
    instanceId,
    targetId,
    sourceId,
    logKey: INSTANCE_LOG_KEYS.GLOBAL_VARIABLE_NOT_FOUND,
    logVars: {
      key: requested?.key,
    },
    type: InstanceLogModelTypeEnum.WARNING,
  });
}

export const consumerGlobalVariablesUpdates = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { globalVariables } = config;

  if (!globalVariables) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );

  const instanceGlobalVars = instanceCache?.instance?.globalVariables;

  const updatedVariables: Record<string, GlobalVariableDTO> = {};

  globalVariables.variables?.forEach((requested) => {
    const glVarValue = instanceGlobalVars?.[requested?.key];

    if (!glVarValue) {
      logErrorEmptyVar(instanceId, targetId, sourceId, requested);
      return;
    }

    const valueUseForUpdate = inputValueParser(
      inputParameterValues,
      requested?.value
    );

    const currentValue = parseString(glVarValue.value);

    const newValue = getNewValue(requested, currentValue, valueUseForUpdate);

    updatedVariables[glVarValue.key] = {
      ...glVarValue,
      value: newValue as string,
    };
  });

  await updateGlobalVariables(instanceId, updatedVariables);

  return {
    outputParameterValues: {
      ...updatedVariables,
    },
  };
};
