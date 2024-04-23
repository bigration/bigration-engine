import { INSTANCE_LOG_KEYS } from '../constants';

type CustomErrorType = {
  raw?: string;
  logKey: INSTANCE_LOG_KEYS;

  logVars?: object;
  references?: object;
};

export class CustomWorkflowError extends Error {
  fullError: CustomErrorType;

  constructor(error: CustomErrorType) {
    super();
    this.fullError = error;
    this.name = JSON.stringify(error);
    Error.captureStackTrace(this, CustomWorkflowError);

    Object.setPrototypeOf(this, CustomWorkflowError.prototype);
  }
}
