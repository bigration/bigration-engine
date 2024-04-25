import { consumerConditionalPathTask } from '../consumer-conditional-path-task';
import * as helpers from '../conditional-helpers';
import {
  ConditionalPathAction,
  Flow,
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';
import { MessageActionFlowType } from '../../../types';
import { initCache, initNewInstanceRunCache } from '../../../cache';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'REST',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'conditional test',
    type: 'CONDITIONAL_PATH',
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

describe('consumerConditionalPathTask', () => {
  beforeEach(async () => {
    await initCache();
  });

  it('should return the correct response when the conditional path is valid', async () => {
    const conditionalPath: ConditionalPathAction = {
      type: 'AND',
      groups: [
        {
          operator: 'EQUALS',
          leftSide: '{{{leftExpression1}}}',
          rightSide: '{{{leftExpression2}}}',
        },
        {
          operator: 'GREATER_THAN_EQUALS',
          leftSide: '{{{aaaa}}}',
          rightSide: '{{{bbbb}}}',
        },
      ],
    };
    const outgoingFlows: Array<Flow> = [
      {
        sourceId: '123',
        targetId: '321',
        sourceHandle: 'A',
        sourceType: 'CONDITIONAL_PATH',
        targetType: 'REST',
        targetHandle: 'A',
      },
    ];

    const isAPathValidSpy = jest.spyOn(helpers, 'isAPathValid');
    const getExpressionResultSpy = jest.spyOn(helpers, 'getExpressionResult');

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

    const response = await consumerConditionalPathTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          outgoingFlows,
          config: {
            conditionalPath,
          },
        },
      },
      {
        leftExpression1: 'value1',
        leftExpression2: 'value1',
        aaaa: '9',
        bbbb: '1',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        valid: true,
      },
      overriddenOutgoingFlows: [
        {
          sourceHandle: 'A',
          sourceId: '123',
          sourceType: 'CONDITIONAL_PATH',
          targetHandle: 'A',
          targetId: '321',
          targetType: 'REST',
        },
      ],
    });

    expect(isAPathValidSpy).toHaveBeenCalledWith('AND', [true, true]);
    expect(getExpressionResultSpy).toHaveBeenCalledTimes(1);
    expect(getExpressionResultSpy).toHaveBeenCalledWith(
      conditionalPath.groups,
      {
        leftExpression1: 'value1',
        leftExpression2: 'value1',
        aaaa: '9',
        bbbb: '1',
      },
      messageAction.instanceId,
      messageAction.sourceId,
      messageAction.targetId
    );
  });

  it('should return the correct response when the conditional path is invalid (AND)', async () => {
    const conditionalPath: ConditionalPathAction = {
      type: 'AND',
      groups: [
        {
          operator: 'EQUALS',
          leftSide: '{{{leftExpression1}}}',
          rightSide: '{{{leftExpression2}}}',
        },
        {
          operator: 'GREATER_THAN_EQUALS',
          leftSide: '{{{aaaa}}}',
          rightSide: '{{{bbbb}}}',
        },
      ],
    };
    const outgoingFlows: Array<Flow> = [
      {
        sourceId: '123',
        targetId: '321',
        sourceHandle: 'A',
        sourceType: 'CONDITIONAL_PATH',
        targetType: 'REST',
        targetHandle: 'A',
      },
      {
        sourceId: '123',
        targetId: '555',
        sourceHandle: 'B',
        sourceType: 'CONDITIONAL_PATH',
        targetType: 'REST',
        targetHandle: 'A',
      },
    ];
    const isAPathValidSpy = jest.spyOn(helpers, 'isAPathValid');
    const getExpressionResultSpy = jest.spyOn(helpers, 'getExpressionResult');

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

    const response = await consumerConditionalPathTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          outgoingFlows,
          config: {
            conditionalPath,
          },
        },
      },
      {
        leftExpression1: 'value1',
        leftExpression2: 'value1',
        aaaa: '1',
        bbbb: '9',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        valid: false,
      },
      overriddenOutgoingFlows: [
        {
          sourceHandle: 'B',
          sourceId: '123',
          sourceType: 'CONDITIONAL_PATH',
          targetHandle: 'A',
          targetId: '555',
          targetType: 'REST',
        },
      ],
    });

    expect(isAPathValidSpy).toHaveBeenCalledWith('AND', [true, false]);
    expect(getExpressionResultSpy).toHaveBeenCalledWith(
      conditionalPath.groups,
      {
        leftExpression1: 'value1',
        leftExpression2: 'value1',
        aaaa: '1',
        bbbb: '9',
      },
      messageAction.instanceId,
      messageAction.sourceId,
      messageAction.targetId
    );
  });

  it('should return the correct response when the conditional path is valid (OR) and outgoingFlowBtoA NOT exists and WAITING', async () => {
    const conditionalPath: ConditionalPathAction = {
      type: 'OR',
      groups: [
        {
          operator: 'EQUALS',
          leftSide: '{{{leftExpression1}}}',
          rightSide: '{{{leftExpression2}}}',
        },
        {
          operator: 'GREATER_THAN_EQUALS',
          leftSide: '{{{aaaa}}}',
          rightSide: '{{{bbbb}}}',
        },
      ],
    };
    const outgoingFlowsAtoA: Array<Flow> = [
      {
        sourceId: '123',
        targetId: '321',
        sourceHandle: 'A',
        sourceType: 'CONDITIONAL_PATH',
        targetType: 'REST',
        targetHandle: 'A',
      },
    ];
    const isAPathValidSpy = jest.spyOn(helpers, 'isAPathValid');
    const getExpressionResultSpy = jest.spyOn(helpers, 'getExpressionResult');

    const response = await consumerConditionalPathTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          outgoingFlows: outgoingFlowsAtoA,
          config: {
            conditionalPath,
          },
        },
      },
      {
        leftExpression1: 'value1',
        leftExpression2: 'value2',
        aaaa: '2',
        bbbb: '8',
      }
    );

    expect(response).toEqual({
      outputParameterValues: {
        valid: false,
      },
      stopInstance: true,
    });

    expect(isAPathValidSpy).toHaveBeenCalledWith('OR', [false, false]);
    expect(getExpressionResultSpy).toHaveBeenCalledWith(
      conditionalPath.groups,
      {
        leftExpression1: 'value1',
        leftExpression2: 'value2',
        aaaa: '2',
        bbbb: '8',
      },
      messageAction.instanceId,
      messageAction.sourceId,
      messageAction.targetId
    );
  });
});
