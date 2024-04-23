import { Chat } from 'openai/resources';
import OpenAI from 'openai';

export function executeOpenAiCompletion(
  apiKey: string,
  completion: Chat.ChatCompletionCreateParamsNonStreaming
) {
  const openai = new OpenAI({
    apiKey,
  });
  return openai.chat.completions.create(completion);
}
