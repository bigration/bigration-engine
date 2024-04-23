import {
  InstanceActionModel,
  IntegrationModel,
  IntegrationTelegramConfig,
  TelegramAction,
} from '@bigration/studio-api-interface';

import { sendMediaGroup, sendMessage } from './telegram-sender';
import { AxiosResponse } from 'axios';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { CustomWorkflowError, fetchIntegration } from '../../common';
import { inputValueParser } from '../../utils';
import { INSTANCE_LOG_KEYS } from '../../constants';

export const consumerTelegramTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { action } = instanceAction;
  const { config } = action;
  const { telegram } = config;

  const integration: IntegrationModel = await fetchIntegration(
    messageAction,
    action?.involvedIntegrationId
  );

  if (!telegram || !integration?.telegram) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
    });
  }

  const { data, headers, status } = await telegramRequest({
    inputParameterValues,
    telegram,
    integration: integration?.telegram,
    messageAction,
  });

  return {
    outputParameterValues: { data, headers, status },
  };
};

export async function telegramRequest({
  integration,
  inputParameterValues,
  telegram,
  messageAction,
}: {
  integration: IntegrationTelegramConfig;
  inputParameterValues: Record<string, unknown>;
  telegram: TelegramAction;
  messageAction: MessageActionFlowType;
}): Promise<AxiosResponse> {
  const token = integration.token;

  if (!token) {
    throw Error('Missing telegram token');
  }

  if (telegram.images) {
    return await sendMediaGroup({
      caption: inputValueParser(inputParameterValues, telegram.text),
      chatId: inputValueParser(inputParameterValues, telegram.chatId),
      images: inputValueParser(inputParameterValues, telegram.images),
      parseMode: telegram.parseMode,
      protectContent: telegram.protectContent,
      telegramKey: token?.decryptedValue,
      messageAction,
    });
  } else {
    return await sendMessage({
      text: inputValueParser(inputParameterValues, telegram.text),
      chatId: inputValueParser(inputParameterValues, telegram.chatId),
      parseMode: telegram.parseMode,
      protectContent: telegram.protectContent,
      telegramKey: token?.decryptedValue,
      messageAction,
    });
  }
}
