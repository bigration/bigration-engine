import { AxiosResponse } from 'axios';
import { TelegramActionParseModeEnum } from '@bigration/studio-api-interface';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { ParseResults, ServiceRestClient } from '../../utils';
import { MessageActionFlowType } from '../../types';
import { logEvent } from '../../logger';

export const TELEGRAM_HOST_BOT = 'https://api.telegram.org/bot';

export async function sendMessage({
  telegramKey,
  chatId,
  text,
  parseMode,
  protectContent = false,
  messageAction,
}: {
  telegramKey?: string;
  chatId: ParseResults;
  text: ParseResults;
  parseMode?: TelegramActionParseModeEnum;
  protectContent?: boolean;
  messageAction: MessageActionFlowType;
}): Promise<AxiosResponse> {
  const requestConfig = {
    baseURL: `${TELEGRAM_HOST_BOT}${telegramKey}/sendMessage`,
    method: 'POST',
    data: {
      method: 'sendMessage',
      chat_id: chatId.parsedValue,
      text: text.parsedValue,
      parse_mode: parseMode,
      protect_content: protectContent,
    },
  };

  logEvent({
    instanceId: messageAction.instanceId,
    sourceId: messageAction.sourceId,
    targetId: messageAction.targetId,
    logKey: INSTANCE_LOG_KEYS.TELEGRAM_REQUEST_DATA,
    references: requestConfig,
  });

  return await ServiceRestClient.request(requestConfig);
}

export async function sendMediaGroup({
  telegramKey,
  chatId,
  caption,
  images,
  parseMode,
  protectContent = false,
  messageAction,
}: {
  telegramKey?: string;
  chatId: ParseResults;
  caption?: ParseResults;
  images: ParseResults;
  parseMode?: TelegramActionParseModeEnum;
  protectContent?: boolean;
  messageAction: MessageActionFlowType;
}): Promise<AxiosResponse> {
  let media;

  if (images?.array) {
    media = images?.array?.map((attachment, index) => {
      return {
        type: 'photo',
        caption: index === 0 ? caption?.parsedValue : undefined,
        parse_mode: index === 0 ? parseMode : undefined,
        media: attachment,
      };
    });
  } else {
    media = [
      {
        type: 'photo',
        caption: caption?.parsedValue,
        media: images?.parsedValue,
        parse_mode: parseMode,
      },
    ];
  }

  const requestConfig = {
    baseURL: `${TELEGRAM_HOST_BOT}${telegramKey}/sendMediaGroup`,
    method: 'POST',
    data: {
      method: 'sendMediaGroup',
      chat_id: chatId?.parsedValue,
      media,
      parse_mode: parseMode,
      protect_content: protectContent,
    },
  };

  logEvent({
    instanceId: messageAction.instanceId,
    sourceId: messageAction.sourceId,
    targetId: messageAction.targetId,
    logKey: INSTANCE_LOG_KEYS.TELEGRAM_REQUEST_DATA,
    references: requestConfig,
  });
  return await ServiceRestClient.request(requestConfig);
}
