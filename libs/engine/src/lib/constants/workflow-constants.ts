export enum INSTANCE_LOG_KEYS {
  UNKNOWN = 'UNKNOWN', // Unknown log key

  ACTION_RUN = 'ACTION_RUN', // Action run log key
  ACTION_TRIGGERING = 'ACTION_TRIGGERING', // Action triggering log key
  ACTION_STATUS_CHANGE = 'ACTION_STATUS_CHANGE', // Action status change log key
  ACTION_FOUND = 'ACTION_FOUND', // Action found log key
  ACTION_INPUT_PARAMS = 'ACTION_INPUT_PARAMS', // Action input parameters log key
  ACTION_OUTPUT_VALUES = 'ACTION_OUTPUT_VALUES', // Action output values log key

  // Instance events
  FOUND_INSTANCE_FOR_WORKFLOW = 'FOUND_INSTANCE_FOR_WORKFLOW', // Found instance for workflow log key
  INSTANCE_TEMP_VARIABLES = 'INSTANCE_TEMP_VARIABLES', // Instance temporary variables log key
  INSTANCE_INPUT_PARAMS = 'INSTANCE_INPUT_PARAMS', // Instance input parameters log key
  INSTANCE_RUN = 'INSTANCE_RUN', // Instance run log key
  INSTANCE_STATUS_CHANGE = 'INSTANCE_STATUS_CHANGE', // Instance status change log key

  // Integration events
  INTEGRATION_FOUND = 'INTEGRATION_FOUND', // Integration found log key

  // Errors
  ERROR_CAN_NOT_FIND_INSTANCE = 'ERROR_CAN_NOT_FIND_INSTANCE', // Error: Cannot find instance log key
  ERROR_OUT_OF_QUOTA_FOR_CURRENT_MONTH = 'ERROR_OUT_OF_QUOTA_FOR_CURRENT_MONTH', // Error: Out of quota for current month log key
  ERROR_INPUT_VALUE_HAS_RESERVED_WORD = 'ERROR_INPUT_VALUE_HAS_RESERVED_WORD', // Error: Input value has reserved word log key
  ERROR_INPUT_PARAM_NOT_DEFINED = 'ERROR_INPUT_PARAM_NOT_DEFINED', // Error: Input parameter not defined log key
  ERROR_INPUT_PARAM_NOT_FOUND = 'ERROR_INPUT_PARAM_NOT_FOUND', // Error: Input parameter not found log key
  ERROR_ACTION_CONFIGURATION_NOT_FOUND = 'ERROR_ACTION_CONFIGURATION_NOT_FOUND', // Error: Action configuration not found log key

  // Warnings
  WARNING_VALUE_NOT_FOUND_FOR_INPUT = 'WARNING_VALUE_NOT_FOUND_FOR_INPUT', // Warning: Value not found for input log key

  // Other
  TELEGRAM_REQUEST_DATA = 'TELEGRAM_REQUEST_DATA', // Telegram request data log key
  REST_ENDPOINT_REQUEST_DATA = 'REST_ENDPOINT_REQUEST_DATA', // REST endpoint request data log key
  MAIL_MESSAGE_DATA = 'MAIL_MESSAGE_DATA',
  LOOP_ITERATION_FINISHED = 'LOOP_ITERATION_FINISHED', // Loop iteration finished log key
  CONDITIONAL_PATH_EXPRESSION_RESULT = 'CONDITIONAL_PATH_EXPRESSION_RESULT', // Conditional path expression result log key
  CONDITIONAL_PATH_PATH_IS_VALID = 'CONDITIONAL_PATH_PATH_IS_VALID', // Conditional path is valid log key
  CONDITIONAL_PATH_PATH_IS_NOT_VALID = 'CONDITIONAL_PATH_PATH_IS_NOT_VALID', // Conditional path is not valid log key

  GLOBAL_VARIABLE_NOT_FOUND = 'GLOBAL_VARIABLE_NOT_FOUND', // Global variable not found log key

  NO_FILTERABLE_VALUE_FOUND = 'NO_FILTERABLE_VALUE_FOUND',

  PARSED_VALUE = 'PARSED_VALUE',

  NO_OBJECT_TO_GET = 'NO_OBJECT_TO_GET',

  OPENAI_COMPLETION_REQUEST = 'OPENAI_COMPLETION_REQUEST', // OpenAI completion request log key

  SWITCH_CASE_MATCH_FOUND = 'SWITCH_CASE_MATCH_FOUND', // Switch case match found key
  SWITCH_CASE_NO_MATCH_FOUND = 'SWITCH_CASE_NO_MATCH_FOUND', // Switch case no match found key
}
