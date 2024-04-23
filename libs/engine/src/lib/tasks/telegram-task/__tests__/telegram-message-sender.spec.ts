import { initCache } from '../../../cache';
import * as logger from '../../../logger/logs-producer';
import { MessageActionFlowType } from '../../../types';
import { sendMediaGroup, sendMessage } from '../telegram-sender';

const messageAction: MessageActionFlowType = {
  sourceId: '555',
  targetId: '123',
  instanceId: '321',
  actionType: 'TELEGRAM',
};

describe('telegram sender', () => {
  const telegramKey = '2015991048:AAG7pJ7DzkOTwz6Qx4sT02lQEWbli691a9s';
  const chatId = '-1001533594900';
  jest.setTimeout(30000);

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });

  it('send image with first caption', async () => {
    const logEvent = jest.spyOn(logger, 'logEvent');

    const response = await sendMediaGroup({
      messageAction,
      telegramKey: telegramKey,
      chatId: { parsedValue: chatId },
      caption: { parsedValue: 'asd' },
      images: {
        array: [
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
        ],
      },
    });

    expect(response.data.ok).toBeTruthy();

    expect(logEvent).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: '321',
      logKey: 'TELEGRAM_REQUEST_DATA',
      references: {
        baseURL:
          'https://api.telegram.org/bot2015991048:AAG7pJ7DzkOTwz6Qx4sT02lQEWbli691a9s/sendMediaGroup',
        data: {
          chat_id: '-1001533594900',
          media: [
            {
              caption: 'asd',
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
            },
            {
              caption: undefined,
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
            },
            {
              caption: undefined,
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
            },
          ],
          method: 'sendMediaGroup',
          parse_mode: undefined,
          protect_content: false,
        },
        method: 'POST',
      },
    });
  });

  it('send image with first caption in HTML', async () => {
    const logEvent = jest.spyOn(logger, 'logEvent');

    const response = await sendMediaGroup({
      messageAction,
      telegramKey: telegramKey,
      chatId: { parsedValue: chatId },
      caption: {
        parsedValue:
          '<b>bold</b>, <strong>bold</strong>\n<i>italic</i>, <em>italic</em>\n<u>underline</u>, <ins>underline</ins>',
      },
      parseMode: 'HTML',
      images: {
        array: [
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
        ],
      },
    });

    expect(response.data.ok).toBeTruthy();

    expect(logEvent).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: '321',
      logKey: 'TELEGRAM_REQUEST_DATA',
      references: {
        baseURL:
          'https://api.telegram.org/bot2015991048:AAG7pJ7DzkOTwz6Qx4sT02lQEWbli691a9s/sendMediaGroup',
        data: {
          chat_id: '-1001533594900',
          media: [
            {
              caption: `<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>`,
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
              parse_mode: 'HTML',
            },
            {
              caption: undefined,
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
              parse_mode: undefined,
            },
          ],
          method: 'sendMediaGroup',
          parse_mode: 'HTML',
          protect_content: false,
        },
        method: 'POST',
      },
    });
  });

  it('send image without caption', async () => {
    const logEvent = jest.spyOn(logger, 'logEvent');

    const response = await sendMediaGroup({
      messageAction,
      telegramKey: telegramKey,
      chatId: { parsedValue: chatId },
      images: {
        parsedValue:
          'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
      },
    });

    expect(logEvent).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: '321',
      logKey: 'TELEGRAM_REQUEST_DATA',
      references: {
        baseURL:
          'https://api.telegram.org/bot2015991048:AAG7pJ7DzkOTwz6Qx4sT02lQEWbli691a9s/sendMediaGroup',
        data: {
          chat_id: '-1001533594900',
          media: [
            {
              caption: undefined,
              media:
                'https://www.gstatic.com/images/branding/product/2x/apps_script_48dp.png',
              type: 'photo',
            },
          ],
          method: 'sendMediaGroup',
          parse_mode: undefined,
          protect_content: false,
        },
        method: 'POST',
      },
    });

    expect(response.data.ok).toBeTruthy();
  });

  it('send text with HTML parse mode', async () => {
    const logEvent = jest.spyOn(logger, 'logEvent');

    const parsedValue = `<b>bold</b>, <strong>bold</strong>
<i>italic</i>, <em>italic</em>
<u>underline</u>, <ins>underline</ins>
<s>strikethrough</s>, <strike>strikethrough</strike>, <del>strikethrough</del>
<span class="tg-spoiler">spoiler</span>, <tg-spoiler>spoiler</tg-spoiler>
<b>bold <i>italic bold <s>italic bold strikethrough <span class="tg-spoiler">italic bold strikethrough spoiler</span></s> <u>underline italic bold</u></i> bold</b>
<a href="http://www.example.com/">inline URL</a>
<a href="tg://user?id=123456789">inline mention of a user</a>
<code>inline fixed-width code</code>
<pre>pre-formatted fixed-width code block</pre>
<pre><code class="language-python">pre-formatted fixed-width code block written in the Python programming language</code></pre>`;
    const response = await sendMessage({
      messageAction,
      telegramKey: telegramKey,
      chatId: { parsedValue: chatId },
      text: {
        parsedValue: parsedValue,
      },
      parseMode: 'HTML',
    });

    expect(response.data.ok).toBeTruthy();

    expect(logEvent).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: '321',
      logKey: 'TELEGRAM_REQUEST_DATA',
      references: {
        baseURL:
          'https://api.telegram.org/bot2015991048:AAG7pJ7DzkOTwz6Qx4sT02lQEWbli691a9s/sendMessage',
        data: {
          chat_id: '-1001533594900',
          method: 'sendMessage',
          parse_mode: 'HTML',
          protect_content: false,
          text: parsedValue,
        },
        method: 'POST',
      },
    });
  });
});
