import { initCache, initNewInstanceRunCache } from '../../../cache';
import { MessageActionFlowType } from '../../../types';
import * as parallelTask from '../consumer-parallel-task';
import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'PARALLEL',
};

const defaultInstanceAction: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    id: '55555',
    name: 'loop test',
    type: 'PARALLEL',
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
      parallel: {
        waitAll: true,
      },
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'READY',
};

describe('consumer-parallel-task', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });

  it('should throw an error when parallel config is missing', async () => {
    const messageAction: MessageActionFlowType = {
      sourceId: '57567567',
      targetId: '123',
      instanceId: '141413123123',
      actionType: 'PARALLEL',
    };

    const instanceAction: InstanceActionModel = {
      ...defaultInstanceAction,
      action: { ...defaultInstanceAction.action, config: {} },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '141413123123',
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [instanceAction.action.id as string]: instanceAction,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    await expect(
      parallelTask.consumerParallelTask(messageAction, instanceAction)
    ).rejects.toThrowError('Parallel config is missing');
  });

  it('should throw an error when sourceId is not found in tempVariables', async () => {
    const messageAction: MessageActionFlowType = {
      sourceId: '57567567',
      targetId: '123',
      instanceId: '141413123123',
      actionType: 'PARALLEL',
    };

    const instanceAction = {
      ...defaultInstanceAction,
    };

    const newVar: InstanceActionModel = {
      id: '34234234234',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      action: {
        id: '999999',
        name: 'test',
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '141413123123',
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [newVar.action.id as string]: newVar,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    await expect(
      parallelTask.consumerParallelTask(messageAction, instanceAction)
    ).rejects.toThrowError(
      'No incoming flows found for action 123 in instance 141413123123'
    );
  });

  // it('should update tempVariables for sourceId when arrived is set to true', async () => {
  //   const messageAction: MessageActionFlowType = {
  //     sourceId: '57567567',
  //     targetId: '123',
  //     instanceId: '141413123123',
  //     actionType: 'PARALLEL',
  //   };
  //
  //   const instanceAction: InstanceActionModel = {
  //     ...defaultInstanceAction,
  //     action: {
  //       ...defaultInstanceAction.action,
  //       outgoingFlows: [
  //         {
  //           sourceId: '123',
  //           targetId: '57567567',
  //           sourceType: 'PARALLEL',
  //           sourceHandle: 'A',
  //           targetType: 'SWITCH',
  //           targetHandle: 'A',
  //         },
  //       ],
  //     },
  //   };
  //
  //   const getInstanceTempActionVariablesFromCacheSPY = jest.spyOn(
  //     tempCache,
  //     'getInstanceTempActionVariablesFromCache'
  //   );
  //
  //   const outgoingFlow: InstanceActionModel = {
  //     id: '111',
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     action: {
  //       id: '57567567',
  //       name: 'test',
  //     },
  //   };
  //
  //   // jest
  //   //   .spyOn(utils, 'getInstanceActionIncomingFlows')
  //   //   .mockResolvedValueOnce([newVar]);
  //
  //   // jest.spyOn(cache, 'saveInstanceTempActionVariable').mockImplementation();
  //
  //   const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     instance: {
  //       id: '141413123123',
  //       status: 'READY',
  //       fetchedIntegrations: {},
  //     },
  //     instanceActions: {
  //       [instanceAction.action.id as string]: instanceAction,
  //     },
  //   };
  //   await initNewInstanceRunCache(instanceEngineMessageDTO);
  //
  //   const result = await parallelTask.consumerParallelTask(
  //     messageAction,
  //     instanceAction
  //   );
  //   //
  //   // expect(cache.saveInstanceTempActionVariable).toHaveBeenCalledWith({
  //   //   instanceId: messageAction.instanceId,
  //   //   instanceActionId: instanceAction._id,
  //   //   value: {
  //   //     sourceIds: {
  //   //       '57567567': {
  //   //         arrived: true,
  //   //       },
  //   //     },
  //   //   },
  //   // });
  //
  //   expect(result.outputParameterValues).toEqual({
  //     sourceIds: {
  //       '57567567': {
  //         arrived: true,
  //       },
  //     },
  //   });
  // });
  //
  // it('should return outputParameterValues and skipOutgoingFlowsAndWait when parallel.waitAll is true and not all actions have arrived', async () => {
  //   const messageAction: MessageActionFlowType = {
  //     instance: undefined,
  //     instanceActions: undefined,
  //     sourceId: '57567567',
  //     targetId: '123',
  //     instanceId: '141413123123',
  //     actionType: 'PARALLEL',
  //     projectId: '1',
  //     accountId: '2',
  //     workspaceId: '3',
  //     accountStatsId: '4',
  //     workflowId: '5',
  //   };
  //
  //   const instanceAction = {
  //     ...defaultInstanceAction,
  //   };
  //
  //   instanceAction.action.config.parallel.waitAll = true;
  //
  //   jest
  //     .spyOn(cache, 'getInstanceTempActionVariablesFromCache')
  //     .mockResolvedValue(Promise.resolve(undefined));
  //
  //   const newVar1: LeanDocument<InstanceActionModelDocument> = {
  //     _id: '111',
  //     action: {
  //       _id: '57567567',
  //       name: 'test',
  //     },
  //   } as unknown as LeanDocument<InstanceActionModelDocument>;
  //
  //   const newVar2: LeanDocument<InstanceActionModelDocument> = {
  //     _id: '2222',
  //     action: {
  //       _id: '99999999',
  //       name: 'test',
  //     },
  //   } as unknown as LeanDocument<InstanceActionModelDocument>;
  //
  //   jest
  //     .spyOn(utils, 'getInstanceActionIncomingFlows')
  //     .mockResolvedValueOnce([newVar1, newVar2]);
  //
  //   jest.spyOn(cache, 'saveInstanceTempActionVariable').mockImplementation();
  //
  //   const result = await parallelTask.consumerParallelTask(
  //     messageAction,
  //     instanceAction
  //   );
  //
  //   expect(result.outputParameterValues).toEqual({
  //     sourceIds: {
  //       '57567567': {
  //         arrived: true,
  //       },
  //       '99999999': {
  //         arrived: false,
  //       },
  //     },
  //   });
  //
  //   expect(result.skipOutgoingFlows).toBe(true);
  // });
});
