import {
  InstanceActionModel,
  InstanceEngineMessageDTO,
  RegexAction,
} from '@bigration/studio-api-interface';
import { MessageActionFlowType } from '../../../types';
import { initCache, initNewInstanceRunCache } from '../../../cache';
import { consumerRegexTask } from '../consumer-regex-task';
import * as utils from '../../../logger/logs-producer';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'REGEX',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'regex test',
    type: 'REGEX',
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

describe('consumerRegexTest', () => {
  beforeEach(async () => {
    await initCache();
  });

  it('should get match value with simple regex item and return array', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          pattern: '\\w+\\s',
          outcome: 'MATCH',
          flags: 'g',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        some_value_to_match: 'fee fi fo fum',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result: ['fee ', 'fi ', 'fo '],
      },
    });
    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      logKey: 'PARSED_VALUE',
      references: { value: 'fee fi fo fum' },
      sourceId: '57567567',
      targetId: '123',
    });
    expect(logSpy).toHaveBeenCalledWith({
      instanceId: '141413123123',
      logKey: 'UNKNOWN',
      raw: 'Pattern: \\w+\\s, action: MATCH,  result: fee ,fi ,fo ',
      sourceId: '57567567',
      targetId: '123',
    });
  });

  it('should get match value with array regex item and return array', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          pattern: '\\w+\\s',
          outcome: 'MATCH',
          flags: 'g',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        some_value_to_match: [
          'fee fi fo fum',
          'hello how are you',
          'im',
          ' fine ',
        ],
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result: ['fee ', 'fi ', 'fo ', 'hello ', 'how ', 'are ', 'fine '],
      },
    });
  });

  it('should chain removal replacements', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          pattern:
            '(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)',
          outcome: 'REMOVE',
          flags: 'gm',
        },
        {
          replacement: '{{{custom_link}}}',
          outcome: 'REPLACE',
          pattern: '#[^\\s@]*@youngfolks',
          flags: 'g',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        custom_link: 'https://youngfolks.ru',
        some_value_to_match:
          'Ph [club19083861|Александр Каралидзе] \\n\\nполная серия https://boosty.to/akaphoto\\n\\n#native@youngfolks',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result:
          'Ph [club19083861|Александр Каралидзе] \\n\\nполная серия \\n\\nhttps://youngfolks.ru',
      },
    });
  });

  it('should regex is also parsable', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          replacement: '{{{custom_link}}}',
          outcome: 'REPLACE',
          pattern: '#[^\\s@]*@{{{blabla}}}',
          flags: 'g',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        custom_link: 'https://test.ru',
        blabla: 'youngfolks',
        some_value_to_match:
          'Ph [club19083861|Александр Каралидзе] \\n\\nполная серия https://boosty.to/akaphoto\\n\\n#native@youngfolks',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result:
          'Ph [club19083861|Александр Каралидзе] \\n\\nполная серия https://boosty.to/akaphoto\\n\\nhttps://test.ru',
      },
    });
  });

  it('should return boolean on TEST', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          pattern:
            '/(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)/',
          outcome: 'TEST',
          flags: 'gm',
        },
        {
          replacement: '{{{custom_link}}}',
          outcome: 'REPLACE',
          pattern: '#[^\\s@]*@youngfolks',
          flags: 'g',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        custom_link: 'https://youngfolks.ru',
        some_value_to_match:
          'Ph [club19083861|Александр Каралидзе] \\n\\nполная серия https://boosty.to/akaphoto\\n\\n#native@youngfolks',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result: true,
      },
    });
  });

  it('should return empty array if not match', async () => {
    const regexAction: RegexAction = {
      value: '{{{some_value_to_match}}}',
      regexItems: [
        {
          pattern:
            '/(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)/',
          outcome: 'MATCH',
          flags: 'gm',
        },
      ],
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

    const response = await consumerRegexTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          config: {
            regex: regexAction,
          },
        },
      },
      {
        custom_link: 'https://youngfolks.ru',
        some_value_to_match: 'blabla',
        rightSideVar: 'world',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        result: [],
      },
    });
  });
});
