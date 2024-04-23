import {
  getEngineCache,
  initCache,
  saveInstanceTempActionVariable,
} from '../../cache';
import * as tempCache from '../../cache/instance-temp-variables-cache';
import { MessageActionFlowType } from '../../types';
import { consumerLoopTask } from '../consumer-loop-task';

import { Flow, InstanceActionModel } from '@bigration/studio-api-interface';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'REST',
};

const defaultInstanceActionWithNTimesConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'loop test',
    type: 'LOOP',
    inputParameters: [
      {
        parameterName: 'iterator',
        defaultValue: '3',
        source: 'TRIGGER',
      },
    ],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {
      loop: {
        type: 'N_TIMES',
        times: '{{{iteratorTotal}}}',
      },
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'RUNNING',
};

const defaultInstanceActionWithFOREACHConfig: InstanceActionModel = {
  ...defaultInstanceActionWithNTimesConfig,
  action: {
    ...defaultInstanceActionWithNTimesConfig.action,
    config: {
      loop: {
        type: 'FOR_EACH',
        elements: '{{{items}}}',
      },
    },
  },
};

const loopToInterationFlows: Flow[] = [
  {
    sourceId: '1',
    sourceType: 'LOOP',
    sourceHandle: 'A',
    targetId: '3',
    targetType: 'REST',
    targetHandle: 'A',
  },
  {
    sourceId: '1',
    sourceType: 'LOOP',
    sourceHandle: 'B',
    targetId: '2',
    targetType: 'REST',
    targetHandle: 'A',
  },
  {
    sourceId: '1',
    sourceType: 'LOOP',
    sourceHandle: 'A',
    targetId: '6',
    targetType: 'TELEGRAM',
    targetHandle: 'A',
  },
];

describe('consumer-loop-task', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });

  afterEach(async () => {
    await getEngineCache().reset();
    await initCache();
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('initial loop with N_TIMES should exit loop when index is equal to total times with A to A outgoing flow', async () => {
    const inputParameterValues = { iteratorTotal: '3' };

    const instanceAction = { ...defaultInstanceActionWithNTimesConfig };
    instanceAction.action.outgoingFlows = loopToInterationFlows;

    const expectedCachedTempVars = { index: 3, totalTimes: 3 };
    await saveInstanceTempActionVariable({
      instanceId: messageAction.instanceId,
      instanceActionId: instanceAction.id as string,
      value: expectedCachedTempVars,
    });

    const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
      tempCache,
      'getInstanceTempActionVariablesFromCache'
    );

    // const saveInstanceTempActionVariableSPY = jest.spyOn(
    //   tempCache,
    //   'saveInstanceTempActionVariable'
    // );

    const response = await consumerLoopTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledTimes(1);
    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
    });

    // expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledTimes(0);

    expect(response).toEqual({
      outputParameterValues: expectedCachedTempVars,
      overriddenOutgoingFlows: [
        loopToInterationFlows[0],
        loopToInterationFlows[2],
      ],
    });
  });

  it('initial loop with N_TIMES should exit loop when index is equal to total times without outgoing flow', async () => {
    const inputParameterValues = { iteratorTotal: '3' };

    const instanceAction = { ...defaultInstanceActionWithNTimesConfig };
    instanceAction.action.outgoingFlows = [loopToInterationFlows[1]];

    const expectedCachedTempVars = { index: 3, totalTimes: 3 };
    await saveInstanceTempActionVariable({
      instanceId: messageAction.instanceId,
      instanceActionId: instanceAction.id as string,
      value: expectedCachedTempVars,
    });

    const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
      tempCache,
      'getInstanceTempActionVariablesFromCache'
    );

    // const saveInstanceTempActionVariableSPY = jest.spyOn(
    //   tempCache,
    //   'saveInstanceTempActionVariable'
    // );

    await consumerLoopTask(messageAction, instanceAction, inputParameterValues);

    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledTimes(1);
    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
    });

    // expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledTimes(0);

    // expect(response).toEqual({
    //   outputParameterValues: expectedCachedTempVars,
    //   overriddenOutgoingFlows: undefined,
    // });
  });

  // N_TIMES
  it('initial loop with N_TIMES should return 0 index and total times', async () => {
    const inputParameterValues = { iteratorTotal: '3' };

    const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
      tempCache,
      'getInstanceTempActionVariablesFromCache'
    );

    const saveInstanceTempActionVariableSPY = jest.spyOn(
      tempCache,
      'saveInstanceTempActionVariable'
    );

    const instanceAction = { ...defaultInstanceActionWithNTimesConfig };
    instanceAction.action.outgoingFlows = loopToInterationFlows;

    const response = await consumerLoopTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledTimes(1);
    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledWith({
      instanceActionId: messageAction.targetId,
      instanceId: messageAction.instanceId,
    });

    expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledTimes(1);
    expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
      value: {
        index: 1,
        totalTimes: 3,
      },
    });

    expect(response).toEqual({
      outputParameterValues: { index: 0, totalTimes: 3 },
      overriddenOutgoingFlows: [loopToInterationFlows[1]],
    });
  });

  it('initial loop with N_TIMES should throw error when loop outgoing flow not found', async () => {
    const inputParameterValues = { iteratorTotal: '3' };
    const instanceAction = { ...defaultInstanceActionWithNTimesConfig };
    instanceAction.action.outgoingFlows = [];

    await expect(
      consumerLoopTask(messageAction, instanceAction, inputParameterValues)
    ).rejects.toThrowError('Can not find outgoing flow for loop iteration');
  });

  // //   FOR EACH
  it('initial loop with FOR_EACH should return 0 index and elements exist', async () => {
    const inputParameterValues = { items: '["asd", "gr4g"]' };

    const instanceAction = { ...defaultInstanceActionWithFOREACHConfig };
    instanceAction.action.outgoingFlows = loopToInterationFlows;
    const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
      tempCache,
      'getInstanceTempActionVariablesFromCache'
    );

    const saveInstanceTempActionVariableSPY = jest.spyOn(
      tempCache,
      'saveInstanceTempActionVariable'
    );

    const response = await consumerLoopTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledTimes(1);
    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
    });

    expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledTimes(1);
    expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
      value: {
        index: 1,
        totalTimes: 2,
      },
    });

    expect(response).toEqual({
      outputParameterValues: {
        index: 0,
        item: 'asd',
        totalTimes: 2,
      },
      overriddenOutgoingFlows: [loopToInterationFlows[1]],
    });
  });

  it('initial loop with FOR_EACH should exit loop when index is equal to total times without outgoing flow', async () => {
    const inputParameterValues = { items: '["asd", "gr4g"]' };

    const instanceAction = { ...defaultInstanceActionWithFOREACHConfig };
    instanceAction.action.outgoingFlows = [loopToInterationFlows[1]];

    const expectedCachedTempVars = { index: 2, totalTimes: 2 };
    await saveInstanceTempActionVariable({
      instanceId: messageAction.instanceId,
      instanceActionId: instanceAction.id as string,
      value: expectedCachedTempVars,
    });

    const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
      tempCache,
      'getInstanceTempActionVariablesFromCache'
    );

    // const saveInstanceTempActionVariableSPY = jest.spyOn(
    //   tempCache,
    //   'saveInstanceTempActionVariable'
    // );

    await consumerLoopTask(messageAction, instanceAction, inputParameterValues);

    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledTimes(1);
    expect(getInstanceTempActionVariablesFromCacheSPY).toHaveBeenCalledWith({
      instanceId: messageAction.instanceId,
      instanceActionId: messageAction.targetId,
    });

    // expect(saveInstanceTempActionVariableSPY).toHaveBeenCalledTimes(0);

    // expect(response).toEqual({
    //   outputParameterValues: expectedCachedTempVars,
    //   overriddenOutgoingFlows: undefined,
    // });
  });
});
