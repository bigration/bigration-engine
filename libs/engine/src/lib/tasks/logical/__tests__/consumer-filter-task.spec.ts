import {
  FilterAction,
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';
import { MessageActionFlowType } from '../../../types';
import { initCache, initNewInstanceRunCache } from '../../../cache';
import { consumerFilterTask } from '../consumer-filter-task';
import * as utils from '../../../logger/logs-producer';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'FILTER',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'filter test',
    type: 'FILTER',
    inputParameters: [],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {},
  },
  inputValues: {},
  instanceId: '',
  status: 'RUNNING',
};

describe('consumerFilterTask', () => {
  beforeEach(async () => {
    await initCache();
  });

  it('should filter array with single expression EQUALS', async () => {
    const filterAction: FilterAction = {
      itemsToFilter: '{{{real_array}}}',
      condition: {
        type: 'AND',
        groups: [
          {
            operator: 'EQUALS',
            leftSide: '{{{iteration_item}}}',
            rightSide: '{{{rightSideVar}}}',
          },
        ],
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [defaultInstanceActionConfig.action.id as string]:
          defaultInstanceActionConfig,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerFilterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            filter: filterAction,
          },
        },
      },
      {
        real_array: ['hello', 'world', 'hallo', 'world'],
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        filtered: ['world', 'world'],
      },
    });
  });

  it('should filter NESTED array with single expression EQUALS', async () => {
    const filterAction: FilterAction = {
      itemsToFilter: '{{{real_array}}}',
      condition: {
        type: 'AND',
        groups: [
          {
            operator: 'EQUALS',
            leftSide: '{{{iteration_item.value2}}}',
            rightSide: '{{{rightSideVar}}}',
          },
        ],
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [defaultInstanceActionConfig.action.id as string]:
          defaultInstanceActionConfig,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerFilterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            filter: filterAction,
          },
        },
      },
      {
        real_array: [
          {
            lang: 'en',
            value: 'hello',
            value2: 'world',
          },
          {
            lang: 'de',
            value: 'hallo',
            value2: 'welt',
          },
        ],
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        filtered: [
          {
            lang: 'en',
            value: 'hello',
            value2: 'world',
          },
        ],
      },
    });
  });

  it('should filter array with single expression GREATER THAN AND SMALLER THAN', async () => {
    const filterAction: FilterAction = {
      itemsToFilter: '{{{string_array}}}',
      condition: {
        type: 'AND',
        groups: [
          {
            leftSide: '{{{iteration_item}}}',
            operator: 'GREATER_THAN',
            rightSide: '{{{rightSideVar}}}',
          },
          {
            leftSide: '{{{iteration_item}}}',
            operator: 'LESS_THAN_EQUALS',
            rightSide: '{{{rightSideVar2}}}',
          },
        ],
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [defaultInstanceActionConfig.action.id as string]:
          defaultInstanceActionConfig,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerFilterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            filter: filterAction,
          },
        },
      },
      {
        string_array: '["hello", "world", "5", 7, "10", 9]',
        rightSideVar: '6',
        rightSideVar2: 10,
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        filtered: [7, '10', 9],
      },
    });
  });
  //TODO
  // it('should filter NESTED array with single expression GREATER THAN AND SMALLER THAN', async () => {
  //   const filterAction: FilterAction = {
  //     itemsToFilter: '{{{string_array}}}',
  //     condition: {
  //       type: 'AND',
  //       groups: [
  //         {
  //           leftSide: '{{{iteration_item.someValue}}}',
  //           operator: 'GREATER_THAN',
  //           rightSide: '{{{rightSideVar}}}',
  //         },
  //         {
  //           leftSide: '{{{iteration_item.someOtherValue}}}',
  //           operator: 'LESS_THAN_EQUALS',
  //           rightSide: '{{{rightSideVar2}}}',
  //         },
  //       ],
  //     },
  //   };
  //
  //   const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
  //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //     // @ts-ignore
  //     instance: {
  //       id: messageAction.instanceId,
  //       status: 'READY',
  //       fetchedIntegrations: {},
  //     },
  //     instanceActions: {
  //       [defaultInstanceActionConfig.action.id as string]:
  //         defaultInstanceActionConfig,
  //     },
  //   };
  //
  //   await initNewInstanceRunCache(instanceEngineMessageDTO);
  //
  //   const response = await consumerFilterTask(
  //     messageAction,
  //     {
  //       ...defaultInstanceActionConfig,
  //       action: {
  //         ...defaultInstanceActionConfig.action,
  //         config: {
  //           filter: filterAction,
  //         },
  //       },
  //     },
  //     {
  //       string_array:
  //         '["hello", "world", "5", 7, "10", 9, {"someValue": 6}, {"someOtherValue": 10}]',
  //       rightSideVar: '6',
  //       rightSideVar2: 10,
  //       aaaa: '9',
  //       bbbb: '1',
  //     }
  //   );
  //
  //   expect(response).toEqual({
  //     outputParameterValues: {
  //       filtered: [7, '10', 9],
  //     },
  //   });
  // });
  it('should filter object with single expression GREATER THAN AND SMALLER THAN', async () => {
    const filterAction: FilterAction = {
      itemsToFilter: '{{{string_object}}}',
      condition: {
        type: 'AND',
        groups: [
          {
            leftSide: '{{{iteration_item}}}',
            operator: 'GREATER_THAN',
            rightSide: '{{{rightSideVar}}}',
          },
          {
            leftSide: '{{{iteration_item}}}',
            operator: 'LESS_THAN_EQUALS',
            rightSide: '{{{rightSideVar2}}}',
          },
        ],
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [defaultInstanceActionConfig.action.id as string]:
          defaultInstanceActionConfig,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerFilterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            filter: filterAction,
          },
        },
      },
      {
        string_object:
          '{"a": "hello", "b": "world", "c": "5", "d": 7, "e": "10", "f": 9}',
        rightSideVar: '6',
        rightSideVar2: 10,
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        filtered: {
          d: 7,
          e: '10',
          f: 9,
        },
      },
    });
  });

  it('should filter string should not work', async () => {
    const filterAction: FilterAction = {
      itemsToFilter: '{{{string}}}',
      condition: {
        type: 'AND',
        groups: [
          {
            operator: 'GREATER_THAN',
            rightSide: '{{{rightSideVar}}}',
          },
          {
            operator: 'LESS_THAN_EQUALS',
            rightSide: '{{{rightSideVar2}}}',
          },
        ],
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [defaultInstanceActionConfig.action.id as string]:
          defaultInstanceActionConfig,
      },
    };

    const logSpy = jest.spyOn(utils, 'logEvent');

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerFilterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            filter: filterAction,
          },
        },
      },
      {
        string: 'hello im a string',
        rightSideVar: '6',
        rightSideVar2: 10,
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(logSpy).toHaveBeenCalledWith({
      type: 'WARNING',
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'NO_FILTERABLE_VALUE_FOUND',
      references: {
        parsedValue: 'hello im a string',
      },
    });
    expect(response).toEqual({
      outputParameterValues: {},
    });
  });
});
