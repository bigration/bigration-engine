import {
  ActionModelTypeEnum,
  Flow,
  InstanceActionModel,
  InstanceActionModelStatusEnum,
} from '@bigration/studio-api-interface';

export type MessageActionFlowType = {
  sourceId: string; // actionId or instanceId
  targetId: string;
  actionType: ActionModelTypeEnum;
  instanceId: string;
};

export type HandleActionType = (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
) => Promise<HandleActionResponseType>;

export type HandleActionResponseType = {
  outputParameterValues: Record<string, unknown>;
  overriddenOutgoingFlows?: Array<Flow>;
  keepInstanceRunningSkipOutgoing?: boolean;
  stopInstance?: boolean;
  changeActionStatus?: InstanceActionModelStatusEnum;
};
