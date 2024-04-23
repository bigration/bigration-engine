// TODO was not able to get token
// import { InstanceActionModel } from '@bigration/studio-api-interface';
// import {
//   HandleActionResponseType,
//   MessageActionFlowType,
// } from '../../types';
// import { fetchIntegration } from '../../common/fetch-integration';
// import { INSTANCE_LOG_KEYS } from '../../constants';
// import { CustomWorkflowError } from '../../common';
//
// import { parseJson, templateRenderObject } from '../../utils';
// import { logEvent } from '../../logger';
// import { Chat } from 'openai/resources';
// import { executeOpenAiCompletion } from './helpers/open-ai-executor';
// import { GoogleGenerativeAI } from '@google/generative-ai';
//
// export const consumerGeminiTask = async (
//   messageAction: MessageActionFlowType,
//   instanceAction: InstanceActionModel,
//   inputParameterValues: Record<string, unknown>
// ): Promise<HandleActionResponseType> => {
//   const { instanceId, targetId, sourceId } = messageAction;
//   const { action } = instanceAction;
//   const { config } = action;
//   const { openAi } = config;
//
//   const integration = await fetchIntegration(
//     messageAction,
//     action?.involvedIntegrationId
//   );
//
//   if (!openAi || !openAi?.chatCompletion) {
//     throw new CustomWorkflowError({
//       logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
//     });
//   }
//
//   const genAI = new GoogleGenerativeAI('TODO');
//   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//
//   const prompt = 'Write a story about a magic backpack.';
//
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();
//   //
//   // const completion: Chat.ChatCompletionCreateParamsNonStreaming = {
//   //   messages: [
//   //     {
//   //       role: 'system',
//   //       content:
//   //         templateRenderObject(
//   //           inputParameterValues,
//   //           openAi?.chatCompletion?.systemMessage?.content
//   //         ) ?? '',
//   //     },
//   //     {
//   //       role: 'user',
//   //       content:
//   //         openAi?.chatCompletion?.userMessages
//   //           ?.map((message) =>
//   //             templateRenderObject(inputParameterValues, message.content)
//   //           )
//   //           .join('\n') || '',
//   //     },
//   //   ],
//   //   response_format: {
//   //     type: openAi?.chatCompletion?.response_format as 'text' | 'json_object',
//   //   },
//   //   model: openAi.chatCompletion?.model,
//   //   stream: false,
//   //   n: 1,
//   //   user: openAi.chatCompletion.user,
//   // };
//   //
//   // logEvent({
//   //   instanceId,
//   //   targetId,
//   //   sourceId,
//   //   logKey: INSTANCE_LOG_KEYS.OPENAI_COMPLETION_REQUEST,
//   //   references: completion,
//   // });
//   //
//   // const chatCompletions = await executeOpenAiCompletion(
//   //   integration?.openAi?.decryptedValue || '',
//   //   completion
//   // );
//   //
//   // let result: unknown = chatCompletions?.choices?.[0]?.message?.content;
//   //
//   // try {
//   //   result = parseJson(result as string)?.object;
//   // } catch (e) {
//   //   // do nothing
//   // }
//
//   return {
//     outputParameterValues: {},
//   };
// };
//
// export const executeGeminiTask = async () => {
//   const genAI = new GoogleGenerativeAI('TODO');
//   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
//
//   const prompt = 'Write a story about a magic backpack.';
//
//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const text = response.text();
//   //
// };
