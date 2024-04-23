import { initCache, saveInstanceTempActionVariable } from '../../../cache';
import { MessageActionFlowType } from '../../../types';
import { consumerLoggerTask } from '../consumer-logger-task';
import { InstanceActionModel } from '@bigration/studio-api-interface';
import * as utils from './../../../logger/logs-producer';

jest.mock('@bigration/workflow-engine-utils', () => ({
  inputValueParser: jest.fn(),
}));

const messageAction: MessageActionFlowType = {
  sourceId: '555',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'LOGGER',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'logger test',
    type: 'LOGGER',
    inputParameters: [
      {
        parameterName: 'bla',

        defaultValue: '3',
        source: 'TRIGGER',
      },
    ],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {
      logger: {
        tempVariables: true,
        inputsRender: [
          {
            key: 'hello',
            value: '{{{bla}}}',
          },
        ],
      },
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'READY',
};
describe('logger consumer', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });
  it('logs temp vars', async () => {
    const inputParameterValues = {};
    const instanceAction: InstanceActionModel = {
      ...defaultInstanceActionConfig,
    };

    const tempVar = { asd: '2323' };

    await saveInstanceTempActionVariable({
      instanceId: messageAction.instanceId,
      instanceActionId: instanceAction.id as string,
      value: tempVar,
    });

    const logSpy = jest.spyOn(utils, 'logEvent');

    const results = await consumerLoggerTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(results).toEqual({ outputParameterValues: { hello: '0' } });

    expect(logSpy).toHaveBeenCalledWith({
      sourceId: messageAction.sourceId,
      targetId: messageAction.targetId,
      instanceId: messageAction.instanceId,
      logKey: 'INSTANCE_TEMP_VARIABLES',
      references: { 'instance-temp-action-vars:141413123123:123': tempVar },
    });
  });

  it('logs input vars', async () => {
    const inputParameterValues = { bla: '3' };
    const instanceAction: InstanceActionModel = {
      ...defaultInstanceActionConfig,
      action: {
        ...defaultInstanceActionConfig.action,
        config: {
          ...defaultInstanceActionConfig.action.config,
          logger: {
            ...defaultInstanceActionConfig.action.config.logger,
            tempVariables: false,
          },
        },
      },
    };

    const results = await consumerLoggerTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    expect(results).toEqual({ outputParameterValues: { hello: '3' } });
  });
});
