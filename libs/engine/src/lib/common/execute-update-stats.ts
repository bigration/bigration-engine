import { saveStatisticsUpdate } from '../utils/workflow-engine-rest-client';

export function incrementStatusPutIntoQueue(
  calculatedAccountStatisticId: string,
  instanceId: string
) {
  saveStatisticsUpdate({
    calculatedAccountStatisticId: calculatedAccountStatisticId,
    instanceId: instanceId,
  });
}
