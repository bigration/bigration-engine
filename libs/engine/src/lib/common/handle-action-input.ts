import {
  InputParameter,
  InstanceEngineMessageDTO,
  InstanceLogModelTypeEnum,
} from '@bigration/studio-api-interface';
import { KeyValueType, MessageActionFlowType } from '../types';
import { get, isEmpty } from 'lodash';
import { logEvent } from '../logger';
import { INSTANCE_LOG_KEYS } from '../constants';
import { getInstanceRunFromCache } from '../cache';

export async function getInputFromInstance(
  messageAction: MessageActionFlowType,
  inputParameters: Array<InputParameter>
): Promise<Record<string, unknown>> {
  const filteredInput: Array<InputParameter> = inputParameters.filter(
    (param) => param.source === 'TRIGGER'
  );

  if (filteredInput.length === 0) {
    return {};
  }

  const { instanceId } = messageAction;

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );
  if (!instanceCache.instance.outputValues) {
    return {};
  }

  const mappedValues: Array<KeyValueType> = filteredInput.map((inputParams) => {
    return mapInputParamsWithOutputValues({
      instanceId,
      inputParams,
      outputValues: instanceCache.instance.outputValues,
    });
  });

  return reduceToOutput(mappedValues);
}

export async function getInputFromInstanceActions(
  messageAction: MessageActionFlowType,
  inputParameters: Array<InputParameter>
): Promise<Record<string, unknown>> {
  const filteredInput: Array<InputParameter> = inputParameters.filter(
    (param) => param.source === 'ACTION' || param.sourceActionId !== null
  );

  if (filteredInput.length === 0) {
    return {};
  }

  const { instanceId } = messageAction;

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );

  const sourceActions = filteredInput?.map((input) => input.sourceActionId);

  const instanceActions = Object.values(instanceCache.instanceActions).filter(
    (instanceAction) =>
      instanceAction && sourceActions.includes(instanceAction.action.id)
  );

  const actionIdWithOutputValueRecord: Record<string, unknown> = instanceActions
    .filter(
      (action) =>
        action && !!action.outputValues && !isEmpty(action.outputValues)
    )
    .map((instanceAction) => {
      const action = instanceAction?.action;

      if (!action) {
        return {
          key: '',
          value: {},
        };
      }

      if (!action.id) {
        throw Error(`Original action id is missing`);
      }
      const mapped: KeyValueType = {
        key: action.id,
        value: instanceAction.outputValues,
      };

      return mapped;
    })
    .reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {});

  if (Object.keys(actionIdWithOutputValueRecord).length === 0) {
    return {};
  }

  const mappedValues: Array<KeyValueType> = filteredInput
    .filter((inputParam) => inputParam.source === 'ACTION')
    .map((inputParams) => {
      let outputValues: Record<string, unknown> | undefined | unknown =
        undefined;
      if (inputParams.sourceActionId) {
        try {
          outputValues =
            actionIdWithOutputValueRecord[inputParams.sourceActionId];
        } catch (e) {
          console.error('Can not parse mongoose action id as object id');
          console.error(e);
        }
      }

      // if (
      //   outputValues === undefined ||
      //   outputValues === ('' as unknown) ||
      //   outputValues === null
      // ) {
      //   return undefined;
      // }

      return mapInputParamsWithOutputValues({
        instanceId,
        inputParams,
        outputValues,
      });
    })
    .filter(
      (item) =>
        item !== undefined &&
        item.value !== undefined &&
        item.value !== null &&
        item.value !== ''
    );

  return reduceToOutput(mappedValues);
}

export async function getInputFromGlobalVariables(
  messageAction: MessageActionFlowType,
  inputParameters: Array<InputParameter>
): Promise<Record<string, unknown>> {
  const filteredInput: Array<InputParameter> = inputParameters.filter(
    (param) => param.source === 'GLOBAL_VARIABLE'
  );

  if (filteredInput.length === 0) {
    return {};
  }
  const { instanceId } = messageAction;

  const instanceCache = await getInstanceRunFromCache<InstanceEngineMessageDTO>(
    'instance',
    instanceId
  );

  if (!instanceCache.instance.globalVariables) {
    return {};
  }
  const mappedValues: Array<KeyValueType> = filteredInput.map((inputParams) => {
    const outputValues: Record<string, unknown> = Object.values(
      instanceCache.instance.globalVariables
    ).reduce((obj, item) => {
      if (item) {
        return Object.assign(obj, { [item.key]: item.value });
      }
      return obj;
    }, {});

    return mapInputParamsWithOutputValues({
      instanceId,
      inputParams,
      outputValues,
    });
  });

  return reduceToOutput(mappedValues);
}

function mapInputParamsWithOutputValues({
  instanceId,
  inputParams,
  outputValues,
}: {
  instanceId: string;
  inputParams: InputParameter;
  outputValues: Record<string, unknown> | undefined | unknown;
}): KeyValueType {
  if (outputValues) {
    const value = get(
      outputValues,
      inputParams?.path || inputParams.parameterName
    );
    if (value) {
      return { key: inputParams.parameterName, value };
    }
  }

  logEvent({
    instanceId,
    logKey: INSTANCE_LOG_KEYS.WARNING_VALUE_NOT_FOUND_FOR_INPUT,
    logVars: {
      parameterName: inputParams.parameterName,
      path: inputParams.path,
    },
    type: InstanceLogModelTypeEnum.WARNING,
  });

  return { key: inputParams.parameterName, value: inputParams.defaultValue };
}

function reduceToOutput(mappedValues: Array<KeyValueType>) {
  return mappedValues.reduce(
    (obj, item) => Object.assign(obj, { [item.key]: item.value }),
    {}
  );
}
