import {
  getEngineCache,
  initCache,
  initNewInstanceRunCache,
} from '../../../cache';
import { MessageActionFlowType } from '../../../types';
import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';
import * as utils from './../../../logger/logs-producer';
import { consumerGlobalVariablesUpdates } from '../consumer-global-variables-updates-task';

const messageAction: MessageActionFlowType = {
  sourceId: '555',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'GLOBAL_VARIABLES',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'global vars test',
    type: 'GLOBAL_VARIABLES',
    inputParameters: [],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {},
  },
  inputValues: {},
  instanceId: '',
  status: 'READY',
};

const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  instance: {
    id: messageAction.instanceId,
    status: 'READY',
    fetchedIntegrations: {},
    globalVariables: {
      global_number_string: {
        key: 'global_number_string',
      },
      global_real_number: {
        key: 'global_real_number',
      },
      global_array_string: {
        key: 'global_array_string',
      },
      global_real_array: {
        key: 'global_real_array',
      },
      global_string: {
        key: 'global_string',
      },
    },
  },
  instanceActions: {
    [defaultInstanceActionConfig.id as string]: defaultInstanceActionConfig,
  },
};
describe.skip('global variables updates consumer', () => {
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

  it('replace test with array number string and non existing global var', async () => {
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const inputParameterValues = {
      some_number_string: '0',
      some_real_number: 0,
      some_array_string: '[{"pse": 34}, "34", 43]',
      some_real_array: ['34', 43],
    };
    const instanceAction: InstanceActionModel = {
      ...defaultInstanceActionConfig,
      action: {
        ...defaultInstanceActionConfig.action,
        config: {
          globalVariables: {
            variables: [
              {
                key: 'global_number_string',
                value: '{{{some_number_string}}}',
                action: 'REPLACE',
              },
              {
                key: 'global_real_number',
                value: '{{{some_real_number}}}',
                action: 'REPLACE',
              },
              {
                key: 'global_array_string',
                value: '{{{some_array_string}}}',
                action: 'REPLACE',
              },
              {
                key: 'global_not_exist',
                value: '{{{some_real_array}}}',
                action: 'REPLACE',
              },
              {
                key: 'global_real_array',
                value: '{{{some_real_array}}}',
                action: 'REPLACE',
              },
              {
                key: 'global_string',
                value: 'bla',
                action: 'REPLACE',
              },
            ],
          },
        },
      },
    };

    const logSpy = jest.spyOn(utils, 'logEvent');

    const results = await consumerGlobalVariablesUpdates(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '555',
      logKey: 'GLOBAL_VARIABLE_NOT_FOUND',
      type: 'WARNING',
      logVars: {
        key: 'global_not_exist',
      },
    });

    expect(results).toEqual({
      outputParameterValues: {
        global_array_string: {
          key: 'global_array_string',
          value: [
            {
              pse: 34,
            },
            '34',
            43,
          ],
        },
        global_number_string: {
          key: 'global_number_string',
          value: 0,
        },
        global_real_array: {
          key: 'global_real_array',
          value: ['34', 43],
        },
        global_real_number: {
          key: 'global_real_number',
          value: 0,
        },
        global_string: {
          key: 'global_string',
          value: 'bla',
        },
      },
    });
  });
  it('add test with array number string when current is not defined should act like replace', async () => {
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const inputParameterValues = {
      some_number_string: '0',
      some_real_number: 0,
      some_array_string: '[{"pse": 34}, "34", 43]',
      some_real_array: ['34', 43],
    };
    const instanceAction: InstanceActionModel = {
      ...defaultInstanceActionConfig,
      action: {
        ...defaultInstanceActionConfig.action,
        config: {
          globalVariables: {
            variables: [
              {
                key: 'global_number_string',
                value: '{{{some_number_string}}}',
                action: 'ADD',
              },
              {
                key: 'global_real_number',
                value: '{{{some_real_number}}}',
                action: 'ADD',
              },
              {
                key: 'global_array_string',
                value: '{{{some_array_string}}}',
                action: 'ADD',
              },
              {
                key: 'global_not_exist',
                value: '{{{some_real_array}}}',
                action: 'ADD',
              },
              {
                key: 'global_real_array',
                value: '{{{some_real_array}}}',
                action: 'ADD',
              },
              {
                key: 'global_string',
                value: 'bla',
                action: 'ADD',
              },
            ],
          },
        },
      },
    };

    const results = await consumerGlobalVariablesUpdates(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(results).toEqual({
      outputParameterValues: {
        global_array_string: {
          key: 'global_array_string',
          value: [
            {
              pse: 34,
            },
            '34',
            43,
          ],
        },
        global_number_string: {
          key: 'global_number_string',
          value: 0,
        },
        global_real_array: {
          key: 'global_real_array',
          value: ['34', 43],
        },
        global_real_number: {
          key: 'global_real_number',
          value: 0,
        },
        global_string: {
          key: 'global_string',
          value: 'bla',
        },
      },
    });
  });
  it('add test with array number string should execute addition', async () => {
    await initNewInstanceRunCache({
      ...instanceEngineMessageDTO,
      instance: {
        ...instanceEngineMessageDTO.instance,
        globalVariables: {
          global_number_string: {
            key: 'global_number_string',
            value: '10',
          },
          global_real_number: {
            key: 'global_real_number',
            value: 20 as unknown as string,
          },
          global_array_string: {
            key: 'global_array_string',
            value: [
              {
                pse: 34,
              },
              '34',
              43,
            ] as unknown as string,
          },
          global_real_array: {
            key: 'global_real_array',
            value: [
              {
                test: 99,
              },
              {
                test: 22,
              },
            ] as unknown as string,
          },
          global_string: {
            key: 'global_string',
            value: 'ti or ',
          },
          global_object: {
            key: 'global_object',
            value: {
              test: 'test',
              or: 'or',
            } as unknown as string,
          },
          other_global_object: {
            key: 'global_object',
            value: {
              test: 'test',
              or: {
                test: 'test',
              },
            } as unknown as string,
          },
        },
      },
    });

    const inputParameterValues = {
      some_number_string: '12',
      some_real_number: 45,
      some_array_string: '[{"se": 55}, "55", 11]',
      some_real_array: 'test',
      some_object: { yes: { no: 'no' } },
    };
    const instanceAction: InstanceActionModel = {
      ...defaultInstanceActionConfig,
      action: {
        ...defaultInstanceActionConfig.action,
        config: {
          globalVariables: {
            variables: [
              {
                key: 'global_number_string',
                value: '{{{some_number_string}}}',
                action: 'ADD',
              },
              {
                key: 'global_real_number',
                value: '{{{some_real_number}}}',
                action: 'ADD',
              },
              {
                key: 'global_array_string',
                value: '{{{some_array_string}}}',
                action: 'ADD',
              },
              {
                key: 'global_real_array',
                value: '{{{some_real_array}}}',
                action: 'ADD',
              },
              {
                key: 'global_string',
                value: 'bla',
                action: 'ADD',
              },
              {
                key: 'global_object',
                value: '{{{some_object}}}',
                action: 'ADD',
              },
              {
                key: 'other_global_object',
                value: '{{{some_real_number}}}',
                action: 'ADD',
              },
            ],
          },
        },
      },
    };

    const results = await consumerGlobalVariablesUpdates(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(results).toEqual({
      outputParameterValues: {
        global_array_string: {
          key: 'global_array_string',
          value: [
            {
              pse: 34,
            },
            '34',
            43,
            {
              se: 55,
            },
            '55',
            11,
          ],
        },
        global_number_string: {
          key: 'global_number_string',
          value: 22,
        },
        global_object: {
          key: 'global_object',
          value: {
            or: {
              test: 'test',
            },
            test: 'test',
          },
        },
        global_real_array: {
          key: 'global_real_array',
          value: [
            {
              test: 99,
            },
            {
              test: 22,
            },
            'test',
          ],
        },
        global_real_number: {
          key: 'global_real_number',
          value: 65,
        },
        global_string: {
          key: 'global_string',
          value: ['ti or ', 'bla'],
        },
      },
    });
  });
});
