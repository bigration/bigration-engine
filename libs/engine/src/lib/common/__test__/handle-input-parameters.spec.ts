import { initCache, initNewInstanceRunCache } from '../../cache';
import { MessageActionFlowType } from '../../types/message-action-flow-type';

import * as handeActionInputModule from './../handle-action-input';
import { handleInputParameters } from './../handle-input-parameters';

import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

jest.mock('../../logger', () => {
  const originalModule = jest.requireActual('../../logger');
  return {
    ...originalModule,
    logEvent: jest.fn().mockReturnValue('works!'),
  };
});

describe('handleInputParameters', () => {
  beforeEach(async () => {
    await initCache();
  });
  it('handleInputParameters merge all inputs', async () => {
    const instanceId = '123123123';
    const actionId = '5545454545';
    const globalId = '8787878';

    const messageAction: MessageActionFlowType = {
      actionType: 'TELEGRAM',
      sourceId: '78878',
      targetId: actionId,
      instanceId: '321',
    };

    const getInputFromInstance = jest.spyOn(
      handeActionInputModule,
      'getInputFromInstance'
    );
    getInputFromInstance.mockReturnValue(
      Promise.resolve({ [instanceId]: 'hello im from instance' })
    );

    const getInputFromInstanceActions = jest.spyOn(
      handeActionInputModule,
      'getInputFromInstanceActions'
    );
    getInputFromInstanceActions.mockReturnValue(
      Promise.resolve({ [actionId]: 'hello im from action' })
    );

    const getInputFromManual = jest.spyOn(
      handeActionInputModule,
      'getInputFromGlobalVariables'
    );
    getInputFromManual.mockReturnValue(
      Promise.resolve({ [globalId]: 'hello im from global' })
    );

    const instanceAction: InstanceActionModel = {
      id: '999999',
      action: {
        id: actionId,
        config: {},
        name: '',
        outgoingFlows: [],
        type: 'TELEGRAM',
        workflowId: '',
        workspaceId: '',
        inputParameters: [
          {
            source: 'ACTION',
            parameterName: 'query',
            path: 'query.hello',
            sourceActionId: '123',
            defaultValue: '',
          },
        ],
      },
      inputValues: {},
      instanceId: '',
      status: 'READY',
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',
        fetchedIntegrations: {},
      },
      instanceActions: {
        [instanceAction.action.id as string]: instanceAction,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const results = await handleInputParameters(messageAction, instanceAction);

    expect(getInputFromInstance).toHaveBeenCalled();
    expect(getInputFromInstanceActions).toHaveBeenCalled();

    expect(results).toMatchObject({
      [instanceId]: 'hello im from instance',
      [actionId]: 'hello im from action',
      [globalId]: 'hello im from global',
    });
  });
});
