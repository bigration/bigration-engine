import { ActionModelTypeEnum } from '@bigration/studio-api-interface';
import {
  consumerRestTask,
  consumerTelegramTask,
  consumerLoopTask,
  consumerLoggerTask,
  consumerGlobalVariablesUpdates,
  consumerParallelTask,
  consumerConditionalPathTask,
  consumerMailTask,
  multiConditionalPathTask,
  switchCaseTask,
  consumerOpenaiTask,
  consumerFilterTask,
  consumerValueGetterTask,
  consumerRegexTask,
} from '../tasks';

export const ACTIONS_TYPE_HANDLES: Record<
  ActionModelTypeEnum,
  any | undefined //TODO HandleActionType
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
