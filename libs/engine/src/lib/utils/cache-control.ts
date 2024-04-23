import { INSTANCE_LOG_KEYS } from '../constants';
import {
  clearAndFlushInstanceAndStatistics,
  deleteAllInstanceTempActionVariablesAndFlushThemToDb,
} from '../cache';
import { logEvent, logger } from '../logger';

export const instanceRunFinishedCacheActions = async (instanceId: string) => {
  try {
    await deleteAllInstanceTempActionVariablesAndFlushThemToDb(instanceId);
    await clearAndFlushInstanceAndStatistics(instanceId);
  } catch (e) {
    logger.error(e);
    logEvent({
      instanceId,
      logKey: INSTANCE_LOG_KEYS.UNKNOWN,
      type: 'ERROR',
      raw: 'Error while deleting instance cache at workflow engine, does your workflow has errors or warnings?',
      references: e as object,
    });
  }
};
