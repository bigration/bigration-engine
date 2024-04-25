import { initCache, initNewInstanceRunCache } from '../../../cache';
import { MessageActionFlowType } from '../../../types';
import { consumerRestTask } from '../consumer-rest-task';
import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
  IntegrationModel,
} from '@bigration/studio-api-interface';
import * as utils from '../../../logger/logs-producer';

const defaultIntegration: IntegrationModel = {
  id: '123123123',
  workspaceId: '1',
  name: 'name',
  type: 'REST',
  rest: {
    baseUrl: 'https://dummyjson.com',
    defaultAuthentication: {
      type: 'NONE',
    },
  },
};

const defaultInstanceAction: InstanceActionModel = {
  id: '23123123',
  action: {
    name: 'rest test',
    type: 'REST',
    inputParameters: [],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    involvedIntegrationId: defaultIntegration.id as string,
    config: {
      rest: {
        endpoint: {
          method: 'GET',
          url: '/products/1',
        },
      },
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'READY',
};

const messageAction: MessageActionFlowType = {
  sourceId: '78878',
  targetId: '123',
  instanceId: '321',
  actionType: 'REST',
};

describe('consumer-rest-task', () => {
  jest.setTimeout(30000);

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });

  it('consumerRestTask real call ok', async () => {
    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',
        fetchedIntegrations: {
          [defaultIntegration.id]: defaultIntegration,
        },
      },
      instanceActions: {
        [defaultInstanceAction.id as string]: defaultInstanceAction,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const inputParameterValues = {};

    const instanceAction = { ...defaultInstanceAction };

    const logSpy = jest.spyOn(utils, 'logEvent');

    const response = await consumerRestTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.headers).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.data).toBeDefined();

    expect(logSpy).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: '321',
      logKey: 'REST_ENDPOINT_REQUEST_DATA',
      references: {
        data: undefined,
        headers: {},
        method: 'GET',
        timeout: 30000,
        url: 'https://dummyjson.com/products/1',
      },
    });
  });

  it('consumerRestTask base auth real call ok', async () => {
    const inputParameterValues = {};

    await initCache();

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',

        fetchedIntegrations: {
          [defaultIntegration.id]: {
            ...defaultIntegration,
            rest: {
              ...defaultIntegration.rest,
              baseUrl: 'https://bigration.atlassian.net',
              defaultAuthentication: {
                type: 'BASIC',
                basicAuth: {
                  userName: 'andreasfedorenko@gmail.com',
                  password: {
                    decryptedValue:
                      'ATATT3xFfGF0JnN-L0FKZt_T5qbW0h8PZcv2lk5ZxjyVA1LDcFFA2Ob-7ezd544G8E9G42lH4VKkcdKJWX-d3Ewmkz5Ve_YocH-v5G79SS9dawpIJhBhUM213o8HQQd1usFAbPyKk2zydSOHAOzcyO58Dr2_LAq8BIQQ-UC0rxRQs9Y71V_mkXo=A84198F0',
                  },
                },
              },
            },
          },
        },
      },
      instanceActions: {
        [defaultInstanceAction.id as string]: defaultInstanceAction,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const instanceAction: InstanceActionModel = {
      ...defaultInstanceAction,
      action: {
        ...defaultInstanceAction.action,
        config: {
          rest: {
            endpoint: {
              method: 'GET',
              url: '/rest/api/2/issue/createmeta',
            },
          },
        },
      },
    };

    const logSpy = jest.spyOn(utils, 'logEvent');

    const response = await consumerRestTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.status).toBe(200);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.headers).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.data).toBeDefined();

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '321',
      targetId: '123',
      sourceId: '78878',
      logKey: 'INTEGRATION_FOUND',
      logVars: {
        name: 'name',
        type: 'REST',
      },
    });

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '321',
      targetId: '123',
      sourceId: '78878',
      logKey: 'REST_ENDPOINT_REQUEST_DATA',
      references: {
        url: 'https://bigration.atlassian.net/rest/api/2/issue/createmeta',
        method: 'GET',
        headers: {},
        timeout: 30000,
        auth: {
          username: 'andreasfedorenko@gmail.com',
          password:
            'ATATT3xFfGF0JnN-L0FKZt_T5qbW0h8PZcv2lk5ZxjyVA1LDcFFA2Ob-7ezd544G8E9G42lH4VKkcdKJWX-d3Ewmkz5Ve_YocH-v5G79SS9dawpIJhBhUM213o8HQQd1usFAbPyKk2zydSOHAOzcyO58Dr2_LAq8BIQQ-UC0rxRQs9Y71V_mkXo=A84198F0',
        },
      },
    });
  });
});
