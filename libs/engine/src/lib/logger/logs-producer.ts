import {
  InstanceLogModel,
  InstanceLogModelTypeEnum,
} from '@bigration/studio-api-interface';
import { publishLog } from '../utils/workflow-engine-rest-client';
import { INSTANCE_LOG_KEYS } from '../constants';
import { logger } from './logger';
import { jsonStringify } from '../utils/json-utils';

export type InstanceLogProps = {
  instanceId: string;
  sourceId?: string;

  targetId?: string;
  type?: InstanceLogModelTypeEnum;
  raw?: string;
  logKey: INSTANCE_LOG_KEYS;

  logVars?: object;
  references?: object;
};
export const logEvent = (props: InstanceLogProps) => {
  try {
    const logType = props?.type ? props.type : InstanceLogModelTypeEnum.OK;
    const instanceLog = generateLog(props, logType);
    publishLog(instanceLog);
  } catch (error) {
    logger.error('Can produce logs');
    logger.error(error);
  }
};

function generateLog(
  props: InstanceLogProps,
  type: InstanceLogModelTypeEnum
): InstanceLogModel {
  return {
    instanceId: props.instanceId,
    sourceId: props.sourceId,
    targetId: props.targetId,
    type: type,
    raw: props.raw,
    logKey: props.logKey,
    logVars: props.logVars as { [key: string]: object | undefined },
    references: jsonStringify(props?.references),
    eventTime: new Date(),
    nanoseconds: nanoseconds(),
  };
}

function nanoseconds(): number {
  return Number(process.hrtime.bigint().toString().slice(-9));
}
