import {
  InstanceModelStatusEnum,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';

export type MessageInstanceStatusUpdateType = {
  status: InstanceModelStatusEnum;
  websocketMessage: InstanceEngineMessageDTO;
};
