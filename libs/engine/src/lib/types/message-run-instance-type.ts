import { WorkflowTriggerTypeEnum } from '@bigration/studio-api-interface';
import { InstanceBaseMessageType } from './instance-base-message-type';

export type MessageRunInstanceType = {
  triggerType: WorkflowTriggerTypeEnum;
  references: unknown;
  actionId?: string;
} & InstanceBaseMessageType;
