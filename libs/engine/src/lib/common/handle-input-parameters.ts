import { MessageActionFlowType } from '../types';
import { logEvent } from '../logger';
import {
  getInputFromGlobalVariables,
  getInputFromInstance,
  getInputFromInstanceActions,
} from './handle-action-input';
import { InstanceActionModel } from '@bigration/studio-api-interface';
import { INSTANCE_LOG_KEYS } from '../constants';

export const handleInputParameters = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel
): Promise<Record<string, unknown>> => {
  const { instanceId, targetId, sourceId } = messageAction;

  const inputParameters = instanceAction?.action?.inputParameters;

  if (!inputParameters || inputParameters.length === 0) {
    return {};
  }

  const inputValuesFromInstance: Record<string, unknown> =
    await getInputFromInstance(messageAction, inputParameters);

  const inputValuesFromInstanceActions: Record<string, unknown> =
    await getInputFromInstanceActions(messageAction, inputParameters);

  const inputValuesFromGlobal: Record<string, unknown> =
    await getInputFromGlobalVariables(messageAction, inputParameters);

  const inputValueWithOutputs = {
    ...inputValuesFromInstance,
    ...inputValuesFromInstanceActions,
    ...inputValuesFromGlobal,
  };

  // console.log('inputValuesFromInstance', inputValuesFromInstance);
  // console.log('inputValuesFromGlobal', inputValuesFromInstanceActions);
  // console.log('inputValuesFromGlobal', inputValuesFromGlobal);
  // console.log('inputValueWithOutputs', inputValueWithOutputs);

  logEvent({
    instanceId,
    sourceId,
    targetId,
    logKey: INSTANCE_LOG_KEYS.ACTION_INPUT_PARAMS,
    references: inputValueWithOutputs,
  });

  return inputValueWithOutputs;
};
