import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
  ValueGetterAction,
} from '@bigration/studio-api-interface';
import { MessageActionFlowType } from '../../../types';
import { initCache, initNewInstanceRunCache } from '../../../cache';
import { consumerValueGetterTask } from '../consumer-value-getter-task';
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

describe('consumerValueGetter', () => {
  beforeEach(async () => {
    await initCache();
  });

  it('should get values from nested object returns object', async () => {
    const valueGetterAction: ValueGetterAction = {
      value: '{{{real_object}}}',
      path: 'some.nested.value',
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

    const response = await consumerValueGetterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            valueGetter: valueGetterAction,
          },
        },
      },
      {
        real_object: { some: { nested: { value: { some: 'value' } } } },
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        value: {
          some: 'value',
        },
      },
    });
  });

  it('should get values from nested object returns number', async () => {
    const valueGetterAction: ValueGetterAction = {
      value: '{{{real_object}}}',
      path: 'some.nested.value',
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

    const response = await consumerValueGetterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            valueGetter: valueGetterAction,
          },
        },
      },
      {
        real_object: { hello: 'Asd', some: { nested: { value: 777 } } },
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        value: 777,
      },
    });
  });

  it('should get values from nested object noting found in object', async () => {
    const valueGetterAction: ValueGetterAction = {
      value: '{{{real_object}}}',
      path: 'some.nested.value',
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
    const logSpy = jest.spyOn(utils, 'logEvent');

    const response = await consumerValueGetterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            valueGetter: valueGetterAction,
          },
        },
      },
      {
        real_object: '{ some: { wrong: { value: 777 } } }',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {},
    });

    expect(logSpy).toHaveBeenCalledWith({
      type: 'WARNING',
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'NO_OBJECT_TO_GET',
      references: {
        value: '{ some: { wrong: { value: 777 } } }',
      },
    });
  });

  it('should get values from nested array', async () => {
    const valueGetterAction: ValueGetterAction = {
      value: '{{{real_array}}}',
      path: 'some.nested.value',
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
    const logSpy = jest.spyOn(utils, 'logEvent');

    const response = await consumerValueGetterTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            valueGetter: valueGetterAction,
          },
        },
      },
      {
        real_array: [
          { some: { nested: { value: 'world' } } },
          { some: { nested: { value: 'hello' } } },
          { some: { nested: { value: { some: 'value' } } } },
          'i should stay',
        ],
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        value: [
          'world',
          'hello',
          {
            some: 'value',
          },
        ],
      },
    });

    expect(logSpy).toHaveBeenCalledWith({
      type: 'WARNING',
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'NO_OBJECT_TO_GET',
      references: {
        value: 'i should stay',
      },
    });
  });
});
