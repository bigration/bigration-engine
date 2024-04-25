import { ActionModelTypeEnum } from '@bigration/studio-api-interface';
import {
  consumerConditionalPathTask,
  consumerFilterTask,
  consumerGlobalVariablesUpdates,
  consumerLoggerTask,
  consumerLoopTask,
  consumerMailTask,
  consumerOpenaiTask,
  consumerParallelTask,
  consumerRegexTask,
  consumerRestTask,
  consumerTelegramTask,
  consumerValueGetterTask,
  multiConditionalPathTask,
  switchCaseTask,
} from '../tasks';
import { HandleActionType } from '../types/message-action-flow-type';

export const ACTIONS_TYPE_HANDLES: Record<
  ActionModelTypeEnum,
  HandleActionType | undefined
> = {
  WORKFLOW_EVENT: undefined,
  LOGGER: consumerLoggerTask,
  REGEX: consumerRegexTask,
  GLOBAL_VARIABLES: consumerGlobalVariablesUpdates,
  REST: consumerRestTask,
  MAIL: consumerMailTask,
  FIND_AND_TRANSFORM: undefined,
  CONDITIONAL_PATH: consumerConditionalPathTask,
  MULTI_CONDITIONAL_PATH: multiConditionalPathTask,
  SWITCH: switchCaseTask,
  PARALLEL: consumerParallelTask,
  LOOP: consumerLoopTask,
  FILTER: consumerFilterTask,
  VALUE_GETTER: consumerValueGetterTask,
  DATA_MANIPULATION: undefined,
  DATABASE: undefined,
  TELEGRAM: consumerTelegramTask,
  OPENAI: consumerOpenaiTask,
  TRIGGER: undefined,
};
