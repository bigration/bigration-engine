import { processAction } from './process-action';
import { MessageActionFlowType } from '../types';

export const notifyOutgoingFlow = async (
  messageActionFlow: MessageActionFlowType
) => {
  // const { instanceId, targetId, sourceId } = messageActionFlow;

  // const instance = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
  //   'instance',
  //   instanceId
  // );
  //
  // const sourceAction = instance?.instanceActions?.[sourceId]?.action;
  // const targetAction = instance?.instanceActions?.[targetId]?.action;
  // logEvent({
  //   instanceId,
  //   targetId,
  //   sourceId,
  //   logKey: INSTANCE_LOG_KEYS.ACTION_TRIGGERING,
  //   logVars: {
  //     sourceId: `${sourceAction?.name} (${sourceAction?.id})`,
  //     targetId: `${targetAction?.name} (${targetAction?.id})`,
  //   },
  // });

  processAction(messageActionFlow);
};
