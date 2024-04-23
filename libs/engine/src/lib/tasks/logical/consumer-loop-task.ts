import {
  FlowSourceTypeEnum,
  InstanceActionModel,
  LoopAction,
} from '@bigration/studio-api-interface';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { logEvent } from '../../logger';
import {
  getInstanceTempActionVariablesFromCache,
  saveInstanceTempActionVariable,
} from '../../cache';
import { inputValueParser } from '../../utils';
import { CustomWorkflowError } from '../../common';

type LoopTempVariableType = {
  index: number;
  totalTimes: number | undefined;
};

async function exitFromLoop(
  instanceId: string,
  sourceId: string,
  targetId: string,
  instanceAction: InstanceActionModel,
  tempVariables: LoopTempVariableType
): Promise<HandleActionResponseType> {
  logEvent({
    instanceId,
    sourceId,
    targetId,
    logKey: INSTANCE_LOG_KEYS.LOOP_ITERATION_FINISHED,
  });

  const outgoingFlowAtoA = instanceAction.action.outgoingFlows.filter(
    (flow) => flow.sourceHandle == 'A' && flow.targetHandle == 'A'
  );

  if (!outgoingFlowAtoA || outgoingFlowAtoA.length === 0) {
    return {
      outputParameterValues: tempVariables,
    };
  }

  return {
    outputParameterValues: tempVariables,
    overriddenOutgoingFlows: outgoingFlowAtoA,
  };
}

export const consumerLoopTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { loop } = config;

  if (!loop) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.ERROR_ACTION_CONFIGURATION_NOT_FOUND,
      raw: 'Missing Loop configuration',
      references: loop,
    });
  }

  const cachedVaraible: LoopTempVariableType | undefined =
    await getInstanceTempActionVariablesFromCache<LoopTempVariableType>({
      instanceId,
      instanceActionId: instanceAction.id as string,
    });

  const tempVariables: LoopTempVariableType = cachedVaraible || {
    index: 0,
    totalTimes: undefined,
  };

  if (!tempVariables.totalTimes) {
    setInitialTotalTimes(loop, inputParameterValues, tempVariables);
  }

  // EXIT FROM LOOP
  if (
    tempVariables.totalTimes != undefined &&
    tempVariables.index >= tempVariables.totalTimes
  ) {
    return exitFromLoop(
      instanceId,
      sourceId,
      targetId,
      instanceAction,
      tempVariables
    );
  }

  const iterationOutputParameters = {
    ...getIterationOutputParameters(loop, tempVariables, inputParameterValues),
  };

  // LOOP
  tempVariables.index += 1;
  await saveInstanceTempActionVariable({
    instanceId,
    instanceActionId: instanceAction.id as string,
    value: tempVariables,
  });

  const outgoingFlowBtoA = instanceAction.action.outgoingFlows.find(
    (flow) =>
      flow.sourceHandle == 'B' &&
      flow.sourceType === FlowSourceTypeEnum.LOOP &&
      flow.targetHandle == 'A'
  );

  if (!outgoingFlowBtoA) {
    throw Error('Can not find outgoing flow for loop iteration');
  }

  return {
    outputParameterValues: iterationOutputParameters,
    overriddenOutgoingFlows: [outgoingFlowBtoA],
  };
};

function getIterationOutputParameters(
  loop: LoopAction,
  tempVariables: LoopTempVariableType,
  inputParameterValues: Record<string, unknown>
): Record<string, unknown> {
  if (loop.type === 'FOR_EACH') {
    const array = getArrayOfElements(inputParameterValues, loop);
    return { ...tempVariables, item: array[tempVariables.index] };
  }
  return tempVariables;
}

function getArrayOfElements(
  inputParameterValues: Record<string, unknown>,
  loop: LoopAction
): Array<unknown> {
  const parseElementsArray = inputValueParser(
    inputParameterValues,
    loop?.elements
  );

  if (!parseElementsArray.array) {
    throw new CustomWorkflowError({
      logKey: INSTANCE_LOG_KEYS.UNKNOWN,
      raw: 'Can not parse array from input parameter',
      references: parseElementsArray,
    });
  }
  return parseElementsArray.array;
}

function setInitialTotalTimes(
  loop: LoopAction,
  inputParameterValues: Record<string, unknown>,
  tempVariables: LoopTempVariableType
) {
  switch (loop?.type) {
    case 'FOR_EACH':
      {
        const array = getArrayOfElements(inputParameterValues, loop);

        tempVariables.totalTimes = array.length;
      }

      break;
    case 'N_TIMES': {
      const parseTimes = inputValueParser(inputParameterValues, loop?.times);

      if (!parseTimes.number) {
        throw Error('Can not extract number value from input parameter');
      }

      tempVariables.totalTimes = parseTimes.number;

      break;
    }
    default:
      throw Error('Invalid loop type');
  }
}
