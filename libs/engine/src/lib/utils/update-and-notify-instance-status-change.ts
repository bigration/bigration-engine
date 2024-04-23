import {
  InstanceLogModelTypeEnum,
  InstanceModelStatusEnum,
  InstanceUpdateWebsocketDTO,
} from '@bigration/studio-api-interface';
import { INSTANCE_LOG_KEYS } from '../constants';
import { logEvent } from '../logger';
import { instanceRunFinishedCacheActions } from './cache-control';
import { saveInstanceUpdate } from '../utils/workflow-engine-rest-client';

export const updateAndNotifyInstanceStatusChangeDeleteCache = async ({
  instanceId,
  status,
}: {
  instanceId: string;
  status: InstanceModelStatusEnum;
}) => {
  const instanceUpdate: InstanceUpdateWebsocketDTO = {
    instanceId,
    status,
  };

  saveInstanceUpdate(instanceUpdate);

  logEvent({
    instanceId,
    logKey: INSTANCE_LOG_KEYS.INSTANCE_STATUS_CHANGE,
    logVars: {
      status,
    },
    type:
      status === InstanceModelStatusEnum.ERROR
        ? InstanceLogModelTypeEnum.ERROR
        : InstanceLogModelTypeEnum.OK,
  });

  if (
    status !== InstanceModelStatusEnum.READY &&
    status !== InstanceModelStatusEnum.RUNNING
  ) {
    instanceRunFinishedCacheActions(instanceId);
  }
};
