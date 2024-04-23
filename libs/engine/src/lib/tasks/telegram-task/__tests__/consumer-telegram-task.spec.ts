import { telegramRequest } from '../consumer-telegram-task';
import {
  IntegrationTelegramConfig,
  TelegramAction,
} from '@bigration/studio-api-interface';
import * as telegramSender from '../telegram-sender';
import { MessageActionFlowType } from '../../../types';
import * as utils from '../../../utils/input-value-parser';
import { AxiosResponse } from 'axios';

const messageAction: MessageActionFlowType = {
  sourceId: '888',
  targetId: '123',
  instanceId: '321',
  actionType: 'TELEGRAM',
};

describe('telegram consumer', () => {
  const integration: IntegrationTelegramConfig = {
    token: {
      decryptedValue: '1234567890',
    },
  };

  it('send message called', async () => {
    const inputParameterValues = {};
    const telegram: TelegramAction = {
      text: 'Hello, world!',
      chatId: '1234567890',
      parseMode: 'Markdown',
      protectContent: true,
    };

    const inputValueParser = jest.spyOn(utils, 'inputValueParser');

    const sendMessage = jest.spyOn(telegramSender, 'sendMessage');
    sendMessage.mockReturnValue(
      Promise.resolve({
        config: undefined,
        data: undefined,
        headers: undefined,
        status: 0,
        statusText: '',
      }) as unknown as Promise<AxiosResponse<unknown, unknown>>
    );

    await telegramRequest({
      messageAction,
      integration,
      inputParameterValues,
      telegram,
    });

    expect(inputValueParser).toHaveBeenCalledWith(
      inputParameterValues,
      telegram.text
    );
    expect(inputValueParser).toHaveBeenCalledWith(
      inputParameterValues,
      telegram.chatId
    );

    expect(telegramSender.sendMessage).toHaveBeenCalled();
  });

  it('sendMediaGroup called', async () => {
    const inputParameterValues = {};
    const telegram: TelegramAction = {
      text: 'Hello, world!',
      chatId: '1234567890',
      parseMode: 'Markdown',
      protectContent: true,
      images: 'http://image.jpeg',
    };

    const sendMediaGroup = jest.spyOn(telegramSender, 'sendMediaGroup');
    sendMediaGroup.mockReturnValue(
      Promise.resolve({
        config: undefined,
        data: undefined,
        headers: undefined,
        status: 0,
        statusText: '',
      }) as unknown as Promise<AxiosResponse<unknown, unknown>>
    );

    const inputValueParser = jest.spyOn(utils, 'inputValueParser');

    await telegramRequest({
      messageAction,
      integration,
      inputParameterValues,
      telegram,
    });

    expect(inputValueParser).toHaveBeenCalledWith(
      inputParameterValues,
      telegram.text
    );
    expect(inputValueParser).toHaveBeenCalledWith(
      inputParameterValues,
      telegram.chatId
    );

    expect(inputValueParser).toHaveBeenCalledWith(
      inputParameterValues,
      telegram.images
    );

    expect(telegramSender.sendMediaGroup).toHaveBeenCalled();
  });
});
