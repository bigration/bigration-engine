import {
  InstanceActionModel,
  InstanceActionModelStatusEnum,
  InstanceModelStatusEnum,
} from '@bigration/studio-api-interface';
import { updateAndNotifyInstanceStatusChangeDeleteCache } from './update-and-notify-instance-status-change';
import { updateAndNotifyActionStatusChange } from './update-and-notify-action-status-change';
import { MessageActionFlowType } from '../types';

export async function handlerActionError(
  startTime: [number, number],
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel
) {
  await updateAndNotifyActionStatusChange(
    startTime,
    messageAction,
    InstanceActionModelStatusEnum.ERROR,
    instanceAction
  );
}

export async function handleError({ instanceId }: { instanceId: string }) {
  await updateAndNotifyInstanceStatusChangeDeleteCache({
    instanceId,
    status: InstanceModelStatusEnum.ERROR,
  });
}
