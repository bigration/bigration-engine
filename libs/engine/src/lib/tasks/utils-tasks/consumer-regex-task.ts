import { InstanceActionModel } from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { templateRenderObject } from '../../utils';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { CustomWorkflowError } from '../../common';
import { logEvent } from '../../logger';

export const consumerRegexTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { regex } = config;

  if (regex?.regexItems?.length === 0) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const parsedText = templateRenderObject(
    inputParameterValues,
    regex?.value || ''
  );

  logEvent({
    instanceId,
    sourceId,
    targetId: targetId,
    logKey: INSTANCE_LOG_KEYS.PARSED_VALUE,
    references: { value: parsedText },
  });

  let regexOutcome: string | string[] | boolean = parsedText || '';

  regex?.regexItems?.forEach((regexItem) => {
    const regexPattern =
      templateRenderObject(inputParameterValues, regexItem.pattern) ||
      regexItem.pattern;

    const pattern = new RegExp(regexPattern, regexItem?.flags || 'g');

    const replacement = regexItem.replacement
      ? templateRenderObject(inputParameterValues, regexItem.replacement)
      : undefined;

    if (typeof regexOutcome === 'boolean') {
      return;
    }

    switch (regexItem.outcome) {
      case 'TEST':
        regexOutcome = pattern.test(regexOutcome?.toString() || '');
        break;
      case 'REMOVE':
        regexOutcome = Array.isArray(regexOutcome)
          ? regexOutcome.map((item) => item.replace(pattern, ''))
          : regexOutcome.replace(pattern, '');
        break;
      case 'REPLACE':
        regexOutcome = Array.isArray(regexOutcome)
          ? regexOutcome.map((item) => item.replace(pattern, replacement || ''))
          : regexOutcome.replace(pattern, replacement || '');
        break;
      case 'SPLIT':
        regexOutcome = Array.isArray(regexOutcome)
          ? regexOutcome.flatMap((item) => item.split(pattern))
          : regexOutcome.split(pattern);
        break;
      case 'MATCH':
        regexOutcome = Array.isArray(regexOutcome)
          ? regexOutcome.flatMap((item) => item.match(pattern) || [])
          : regexOutcome.match(pattern) || [];
        break;
      default:
        throw new CustomWorkflowError({
          logKey: INSTANCE_LOG_KEYS.UNKNOWN,
          raw: `Unknown regex action ${regexItem.outcome}`,
        });
    }

    logEvent({
      instanceId,
      sourceId,
      targetId: targetId,
      raw: `Pattern: ${regexPattern}, action: ${regexItem.outcome}, ${
        replacement ? `replacement: ${replacement}` : ''
      } result: ${regexOutcome}`,
      logKey: INSTANCE_LOG_KEYS.UNKNOWN,
    });
  });

  return {
    outputParameterValues: {
      result: regexOutcome,
    },
  };
};
