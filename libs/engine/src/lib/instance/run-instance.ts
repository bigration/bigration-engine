import {
  Flow,
  InstanceEngineMessageDTO,
  InstanceModelStatusEnum,
} from '@bigration/studio-api-interface';

import { updateAndNotifyInstanceStatusChangeDeleteCache } from '../utils/update-and-notify-instance-status-change';
import { notifyOutgoingFlow } from '../utils/notify-outgoing-flow';

import { INSTANCE_LOG_KEYS } from '../constants';
import { initNewInstanceRunCache } from '../cache';
import { logEvent, logger } from '../logger';
import { handleError } from '../utils/error-handlers';
import { incrementStatusPutIntoQueue } from '../common/execute-update-stats';

export const runInstance = async (message: InstanceEngineMessageDTO) => {
  try {
    await initNewInstanceRunCache(message);

    logEvent({
      instanceId: message.instance.id,
      logKey: INSTANCE_LOG_KEYS.INSTANCE_RUN,
      logVars: { triggerType: message.instance.triggeredBy },
      references: message.instance.outputValues,
    });

    incrementStatusPutIntoQueue(
      message.calculatedAccountStatistic.id,
      message.instance.id
    );

    const outgoingFlow: Flow | undefined =
      message.instance?.workflow?.trigger?.outgoingFlow;

    const outgoingFlowExists = !!(
      outgoingFlow?.targetId && outgoingFlow?.targetType
    );

    await updateAndNotifyInstanceStatusChangeDeleteCache({
      instanceId: message.instance.id,
      status: outgoingFlowExists
        ? InstanceModelStatusEnum.RUNNING
        : InstanceModelStatusEnum.FINISHED,
    });

    if (outgoingFlow) {
      await notifyOutgoingFlow({
        instanceId: message.instance.id,
        sourceId: outgoingFlow.sourceId,
        targetId: outgoingFlow.targetId,
        actionType: outgoingFlow.targetType,
      });
    }
  } catch (error) {
    logger.error(error);
    await handleError({ instanceId: message?.instance?.id });
  }
};
