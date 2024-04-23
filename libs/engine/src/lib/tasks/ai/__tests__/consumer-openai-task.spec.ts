import {
  getEngineCache,
  initCache,
  initNewInstanceRunCache,
} from '../../../cache';
import { MessageActionFlowType } from '../../../types';

import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
  IntegrationModel,
  type OpenAiAction,
} from '@bigration/studio-api-interface';

import * as utils from '../../../logger/logs-producer';

import * as helpers from '../helpers/open-ai-executor';
import { consumerOpenaiTask } from '../consumer-openai-task';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'OPENAI',
};

const defaultIntegration: IntegrationModel = {
  id: '123123123',
  workspaceId: '1',
  name: 'name',
  type: 'OPENAI',
  openAi: {
    encryptedValue: 'asd',
    decryptedValue: 'AISJDIAD#*@(89DW)(DI@#',
  },
};

const openAiConfig: OpenAiAction = {
  chatCompletion: {
    model: 'testModel',
    user: '123',
    response_format: 'text',
    systemMessage: {
      role: 'system',
      content: 'test system call',
    },
    userMessages: [
      {
        role: 'user',
        content: 'test user call',
      },
      {
        role: 'user',
        content: 'blabla second call',
      },
    ],
  },
};
const defaultInstanceAction: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'open ai test',
    type: 'OPENAI',
    involvedIntegrationId: defaultIntegration.id as string,
    inputParameters: [],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {
      openAi: openAiConfig,
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'RUNNING',
};

describe('consumer-openai-task', () => {
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

  it('simple completion execution', async () => {
    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
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
    const executeOpenAiCompletionStub = jest.fn();

    const executeOpenAiCompletionSpy = jest
      .spyOn(helpers, 'executeOpenAiCompletion')
      .mockImplementation(executeOpenAiCompletionStub);

    await consumerOpenaiTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    const compeletaionReulsts = {
      messages: [
        { role: 'system', content: 'test system call' },
        {
          role: 'user',
          content: `test user call
blabla second call`,
        },
      ],
      response_format: { type: 'text' },
      model: 'testModel',
      stream: false,
      n: 1,
      user: '123',
    };

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'OPENAI_COMPLETION_REQUEST',
      references: compeletaionReulsts,
    });

    expect(executeOpenAiCompletionSpy).toHaveBeenCalledWith(
      defaultIntegration?.openAi?.decryptedValue as string,
      compeletaionReulsts
    );
  });

  it('replace text param completion execution', async () => {
    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
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

    const inputParameterValues: Record<string, unknown> = {
      blabla1: "what's up",
      'hey-you': 'hey you',
      blabla2: '33',
    };

    const instanceAction: InstanceActionModel = {
      ...defaultInstanceAction,
      action: {
        ...defaultInstanceAction.action,
        config: {
          ...defaultInstanceAction.action.config,
          openAi: {
            ...openAiConfig,
            chatCompletion: {
              ...openAiConfig.chatCompletion,
              userMessages: [
                {
                  role: 'user',
                  content: 'this is first {{{blabla1}}} masssaggggeee',
                },
                {
                  role: 'user',
                  content: 'this is second {{blabla2}} masssaggggeee',
                },
                {
                  role: 'user',
                  content: 'this is simple',
                },
              ],
            },
          },
        },
        inputParameters: [
          {
            parameterName: 'blabla1',
            source: 'TRIGGER',
            defaultValue: 'hey !#$ you man ',
          },
          {
            parameterName: 'blabla2',
            source: 'TRIGGER',
            defaultValue: '23',
          },
        ],
      },
    };
    const logSpy = jest.spyOn(utils, 'logEvent');
    const executeOpenAiCompletionStub = jest.fn();

    const executeOpenAiCompletionSpy = jest
      .spyOn(helpers, 'executeOpenAiCompletion')
      .mockImplementation(executeOpenAiCompletionStub);

    await consumerOpenaiTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    const compeletaionReulsts = {
      messages: [
        { role: 'system', content: 'test system call' },
        {
          role: 'user',
          content: `this is first what's up masssaggggeee
this is second 33 masssaggggeee
this is simple`,
        },
      ],
      response_format: { type: 'text' },
      model: 'testModel',
      stream: false,
      n: 1,
      user: '123',
    };

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'OPENAI_COMPLETION_REQUEST',
      references: compeletaionReulsts,
    });

    expect(executeOpenAiCompletionSpy).toHaveBeenCalledWith(
      defaultIntegration?.openAi?.decryptedValue as string,
      compeletaionReulsts
    );
  });

  it('replace json number and json string completion execution', async () => {
    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: messageAction.instanceId,
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

    const inputParameterValues: Record<string, unknown> = {
      blabla1: '{"hello": "world", "array": [{"hi": "there"}]}',
      'hey-you': 'hey you',
      blabla2: {
        real: 'json',
        array: [
          {
            hi: 'there',
          },
        ],
      },
      simpleNumber: 231253.32,
      blablaJsonArray: [{ hi: 'there' }, 123, 'assdasd'],
    };

    const instanceAction: InstanceActionModel = {
      ...defaultInstanceAction,
      action: {
        ...defaultInstanceAction.action,
        config: {
          ...defaultInstanceAction.action.config,
          openAi: {
            ...openAiConfig,
            chatCompletion: {
              ...openAiConfig.chatCompletion,
              userMessages: [
                {
                  role: 'user',
                  content: 'this is first {{{blabla1}}} masssaggggeee',
                },
                {
                  role: 'user',
                  content: 'this is second {{{blabla2}}} masssaggggeee',
                },
                {
                  role: 'user',
                  content: 'this is number {{{simpleNumber}}}',
                },
                {
                  role: 'user',
                  content: 'this is array {{{blablaJsonArray}}}',
                },
              ],
            },
          },
        },
        inputParameters: [
          {
            parameterName: 'blabla1',
            source: 'TRIGGER',
            defaultValue: 'hey !#$ you man ',
          },
          {
            parameterName: 'blabla2',
            source: 'TRIGGER',
            defaultValue: '23',
          },
          {
            parameterName: 'simpleNumber',
            source: 'TRIGGER',
          },
          {
            parameterName: 'blablaJsonArray',
            source: 'TRIGGER',
          },
        ],
      },
    };
    const logSpy = jest.spyOn(utils, 'logEvent');
    const executeOpenAiCompletionStub = jest.fn();

    const executeOpenAiCompletionSpy = jest
      .spyOn(helpers, 'executeOpenAiCompletion')
      .mockImplementation(executeOpenAiCompletionStub);

    await consumerOpenaiTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    const compeletaionReulsts = {
      messages: [
        { role: 'system', content: 'test system call' },
        {
          role: 'user',
          content: `this is first {"hello": "world", "array": [{"hi": "there"}]} masssaggggeee
this is second {"real":"json","array":[{"hi":"there"}]} masssaggggeee
this is number 231253.32
this is array [{"hi":"there"},123,"assdasd"]`,
        },
      ],
      response_format: { type: 'text' },
      model: 'testModel',
      stream: false,
      n: 1,
      user: '123',
    };

    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      targetId: '123',
      sourceId: '57567567',
      logKey: 'OPENAI_COMPLETION_REQUEST',
      references: compeletaionReulsts,
    });

    expect(executeOpenAiCompletionSpy).toHaveBeenCalledWith(
      defaultIntegration?.openAi?.decryptedValue as string,
      compeletaionReulsts
    );
  });
});
