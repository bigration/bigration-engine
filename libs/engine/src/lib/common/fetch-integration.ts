import { MessageActionFlowType } from '../types';
import { logEvent } from '../logger';
import { INSTANCE_LOG_KEYS } from '../constants';
import {
  InstanceEngineMessageDTO,
  IntegrationModel,
} from '@bigration/studio-api-interface';
import { getInstanceRunFromCache } from '../cache';

export async function fetchIntegration(
  messageAction: MessageActionFlowType,
  integrationId?: string
): Promise<IntegrationModel> {
  const { instanceId, targetId, sourceId } = messageAction;

  if (!integrationId) {
    throw Error(`Missing Integration with id ${integrationId}`);
  }

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );

  const integration = instanceCache.instance.fetchedIntegrations[integrationId];

  if (integration == null) {
    throw Error(`Can not find integration with id ${integrationId}`);
  }

  logEvent({
    instanceId,
    targetId,
    sourceId,
    logKey: INSTANCE_LOG_KEYS.INTEGRATION_FOUND,
    logVars: {
      name: integration?.name,
      type: integration?.type,
    },
  });

  return integration as IntegrationModel;
}
