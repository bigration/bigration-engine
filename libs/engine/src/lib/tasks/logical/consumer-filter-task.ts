import {
  FilterAction,
  InstanceActionModel,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';

import { INSTANCE_LOG_KEYS } from '../../constants';
import { getExpressionResult, isAPathValid } from './conditional-helpers';
import { inputValueParser, ParseResults } from '../../utils';
import { CustomWorkflowError } from '../../common';
import { logEvent } from '../../logger';

function getFilteredResults(
  itemsToFilterParsedValue: ParseResults,
  filter: FilterAction,
  inputParameterValues: Record<string, unknown>,
  instanceId: string,
  sourceId: string,
  targetId: string
): unknown[] | { [key: string]: unknown } | undefined {
  if (itemsToFilterParsedValue.array) {
    return itemsToFilterParsedValue.array?.filter((item) => {
      return isAPathValid(
        filter.condition.type,
        getExpressionResult(
          filter.condition.groups || [],
          { ...inputParameterValues, iteration_item: item },
          instanceId,
          sourceId,
          targetId
        )
      );
    });
  }
  if (itemsToFilterParsedValue.object) {
    const object = itemsToFilterParsedValue.object as {
      [key: string]: unknown;
    };
    return Object.keys(object).reduce(
      (acc: { [key: string]: unknown }, key: string) => {
        const satisfiesCondition = isAPathValid(
          filter.condition.type,
          getExpressionResult(
            filter.condition.groups || [],
            { ...inputParameterValues, iteration_item: object[key] },
            instanceId,
            sourceId,
            targetId
          )
        );
        if (satisfiesCondition) {
          acc[key] = object[key];
        }
        return acc;
      },
      {}
    );
  }
  return undefined;
}

export const consumerFilterTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { filter } = config;

  if (!filter || !filter.condition?.groups) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const itemsToFilterParsedValue = inputValueParser(
    inputParameterValues,
    filter?.itemsToFilter
  );

  const filtered = getFilteredResults(
    itemsToFilterParsedValue,
    filter,
    inputParameterValues,
    instanceId,
    sourceId,
    targetId
  );

  if (!filtered) {
    logEvent({
      type: 'WARNING',
      instanceId,
      sourceId,
      targetId,
      logKey: INSTANCE_LOG_KEYS.NO_FILTERABLE_VALUE_FOUND,
      references: itemsToFilterParsedValue,
    });

    return {
      outputParameterValues: {},
    };
  }

  return {
    outputParameterValues: {
      filtered,
    },
  };
};
