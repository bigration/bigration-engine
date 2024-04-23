import { InstanceActionModel } from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { fetchIntegration } from '../../common/fetch-integration';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { CustomWorkflowError } from '../../common';

import { parseJson, templateRenderObject } from '../../utils';
import { logEvent } from '../../logger';
import { Chat } from 'openai/resources';
import { executeOpenAiCompletion } from './helpers/open-ai-executor';

export const consumerOpenaiTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { openAi } = config;

  const integration = await fetchIntegration(
    messageAction,
    action?.involvedIntegrationId
  );

  if (!openAi || !openAi?.chatCompletion) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const completion: Chat.ChatCompletionCreateParamsNonStreaming = {
    messages: [
      {
        role: 'system',
        content:
          templateRenderObject(
            inputParameterValues,
            openAi?.chatCompletion?.systemMessage?.content
          ) ?? '',
      },
      {
        role: 'user',
        content:
          openAi?.chatCompletion?.userMessages
            ?.map((message) =>
              templateRenderObject(inputParameterValues, message.content)
            )
            .join('\n') || '',
      },
    ],
    response_format: {
      type: openAi?.chatCompletion?.response_format as 'text' | 'json_object',
    },
    model: openAi.chatCompletion?.model,
    stream: false,
    n: 1,
    user: openAi.chatCompletion.user,
  };

  logEvent({
    instanceId,
    targetId,
    sourceId,
    logKey: INSTANCE_LOG_KEYS.OPENAI_COMPLETION_REQUEST,
    references: completion,
  });

  const chatCompletions = await executeOpenAiCompletion(
    integration?.openAi?.decryptedValue || '',
    completion
  );

  let result: unknown = chatCompletions?.choices?.[0]?.message?.content;

  try {
    result = parseJson(result as string)?.object;
  } catch (e) {
    // do nothing
  }

  return {
    outputParameterValues: { ...chatCompletions, result },
  };
};
