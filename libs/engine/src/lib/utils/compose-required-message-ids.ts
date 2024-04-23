import { InstanceEngineMessageDTO } from '@bigration/studio-api-interface';

export type RequiredIds = {
  projectId: string;
  workspaceId: string;
  workflowId: string;
  accountId: string;
  instanceId: string;
  accountStatsId: string;
  actionId?: string;
};

export const composeRequiredMessageIdsFromWebSocketMessage = (
  websocketMessage: InstanceEngineMessageDTO
): RequiredIds => {
  return composeRequiredMessageIds({
    projectId: websocketMessage.instance.workflow.projectId,
    workspaceId: websocketMessage.instance.workflow.workspaceId,
    workflowId: websocketMessage.instance.workflow.id,
    accountId: websocketMessage.calculatedAccountStatistic.accountId,
    instanceId: websocketMessage.instance.id,
    accountStatsId: websocketMessage.calculatedAccountStatistic.id,
  });
};

export const composeRequiredMessageIds = ({
  projectId,
  workspaceId,
  workflowId,
  accountId,
  instanceId,
  accountStatsId,
  actionId,
}: RequiredIds): RequiredIds => {
  if (!projectId) {
    throw Error('Missing project Id');
  }
  if (!workspaceId) {
    throw Error('Missing workspace Id');
  }
  if (!accountId) {
    throw Error('Missing account Id');
  }
  if (!workflowId) {
    throw Error('Missing workflow Id');
  }
  if (!instanceId) {
    throw Error('Missing instance Id');
  }
  if (!accountStatsId) {
    throw Error('Missing account stats Id');
  }

  return {
    projectId,
    workspaceId,
    accountId,
    instanceId,
    workflowId,
    accountStatsId,
    actionId,
  };
};
