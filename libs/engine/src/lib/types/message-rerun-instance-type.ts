import { ActionModelTypeEnum } from '@bigration/studio-api-interface';
import { InstanceBaseMessageType } from './instance-base-message-type';

export type MessageRerunInstanceType = {
  sourceId: string;
  targetId: string;
  actionType: ActionModelTypeEnum;
} & InstanceBaseMessageType;
