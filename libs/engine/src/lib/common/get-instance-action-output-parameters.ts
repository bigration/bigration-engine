import { logEvent } from '../logger';
import { MessageActionFlowType } from '../types';
import { INSTANCE_LOG_KEYS } from '../constants'; // import { publishEvent } from '@bigration/engine-consumers';
import {
  InstanceActionModel,
  InstanceActionUpdateWebsocketDTO,
} from '@bigration/studio-api-interface';
import { updateInstanceActionOutputParams } from '../cache'; // const getOutputValue = (param: OutputParameter, results: unknown): object => {
import { isEmpty } from 'lodash';
import { saveInstanceActionUpdate } from '../utils/workflow-engine-rest-client';
// const getOutputValue = (param: OutputParameter, results: unknown): object => {
//   const { parameterName, path } = param;
//   if (path) {
//     return get(results, path);
//   }
//   return get(results, parameterName);
// };

// export function getOutputParametersValues(
//   outputParameters: Array<OutputParameter>,
//   results: unknown
// ): Array<InstanceOutputParameter> {
//   return outputParameters.map((param) => {
//     const { parameterName } = param;
//     const value = getOutputValue(param, results);
//     const newVar: InstanceOutputParameter = { parameterName, value };
//     return newVar;
//   });
// }
//
// async function getResults(
//   messageAction: MessageActionFlowType,
//   results: unknown,
//   outputParameters: Array<OutputParameter>
// ): Promise<Array<InstanceOutputParameter>> {
//   if (results) {
//     return getOutputParametersValues(outputParameters, results);
//   } else {
//     const { instanceId, actionId } = messageAction;
//     logEvent({
//       instanceId,
//       actionId,
//       log: `Output parameters exist, but no results found`,
//       type: InstanceLogModelTypeEnum.WARNING,
//       references: outputParameters,
//     });
//     return [];
//   }
// }

async function saveOutputParams(
  instanceId: string,
  actionId: string,
  results: object,
  instanceAction: InstanceActionModel
) {
  logEvent({
    instanceId,
    targetId: actionId,
    logKey: INSTANCE_LOG_KEYS.ACTION_OUTPUT_VALUES,
    references: results,
  });

  const instanceActionUpdate: InstanceActionUpdateWebsocketDTO = {
    instanceId,
    actionId: instanceAction.id || '',
    outputValues: results,
  };

  saveInstanceActionUpdate(instanceActionUpdate);
}

export const saveInstanceActionOutputParameters = async (
  messageAction: MessageActionFlowType,
  outputParameterValues: object,
  instanceAction?: InstanceActionModel
) => {
  const { instanceId, targetId } = messageAction;

  if (outputParameterValues && !isEmpty(outputParameterValues)) {
    instanceAction &&
      (await saveOutputParams(
        instanceId,
        targetId,
        outputParameterValues,
        instanceAction
      ));

    await updateInstanceActionOutputParams(
      instanceId,
      targetId,
      outputParameterValues
    );
  }
};
