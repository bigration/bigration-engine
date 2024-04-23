import { InstanceActionModel } from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';

import { INSTANCE_LOG_KEYS } from '../../constants';
import {
  getParsedValue,
  getSingleValueFromParseResult,
  getValueFromInputWithoutTemplateParsing,
  inputValueParser,
  ParseResults,
} from '../../utils';
import { CustomWorkflowError } from '../../common';
import { logEvent } from '../../logger';

function getObjectValue(parsedValue: ParseResults, path?: string) {
  return getSingleValueFromParseResult(
    getValueFromInputWithoutTemplateParsing(parsedValue.object, path)
  );
}

export const consumerValueGetterTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { valueGetter } = config;

  if (!valueGetter || !valueGetter?.value) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const parsedValue = inputValueParser(
    inputParameterValues,
    valueGetter?.value
  );

  if (parsedValue?.object) {
    return {
      outputParameterValues: {
        value: getObjectValue(parsedValue, valueGetter?.path),
      },
    };
  }

  if (parsedValue?.array) {
    const value = parsedValue?.array
      ?.map((item: unknown) => {
        const parsedItem = getParsedValue(item);

        if (parsedItem?.object) {
          return getObjectValue(parsedItem, valueGetter?.path);
        }
        logEvent({
          type: 'WARNING',
          instanceId,
          sourceId,
          targetId,
          logKey: INSTANCE_LOG_KEYS.NO_OBJECT_TO_GET,
          references: { value: parsedItem.parsedValue },
        });

        return undefined;
      })
      .filter((item) => item !== undefined);

    return {
      outputParameterValues: {
        value,
      },
    };
  }

  logEvent({
    type: 'WARNING',
    instanceId,
    sourceId,
    targetId,
    logKey: INSTANCE_LOG_KEYS.NO_OBJECT_TO_GET,
    references: { value: parsedValue?.parsedValue },
  });

  return {
    outputParameterValues: {},
  };
};
