import * as helpers from '../conditional-helpers';
import {
  Flow,
  InstanceActionModel,
  MultiConditionalPathAction,
} from '@bigration/studio-api-interface';
import { multiConditionalPathTask } from '../multi-conditional-path-task';
import { MessageActionFlowType } from '../../../types';
import { initCache } from '../../../cache';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'REST',
};

const defaultInstanceActionConfig: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'switch test',
    type: 'MULTI_CONDITIONAL_PATH',
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

describe('multiConditionalPathTask', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await initCache();
  });

  it('should return A when the conditional path is valid', async () => {
    const multiConditionalPathAction: MultiConditionalPathAction = {
      flowHandleConditionalPath: {
        A: {
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
        },
      },
    };
    const outgoingFlows: Array<Flow> = [
      {
        sourceId: '123',
        targetId: '321',
        sourceHandle: 'A',
        sourceType: 'MULTI_CONDITIONAL_PATH',
        targetType: 'REST',
        targetHandle: 'A',
      },
    ];

    const isAPathValidSpy = jest.spyOn(helpers, 'isAPathValid');
    const getExpressionResultSpy = jest.spyOn(helpers, 'getExpressionResult');

    const response = await multiConditionalPathTask(
      messageAction,
      {
        ...defaultInstanceActionConfig,
        action: {
          ...defaultInstanceActionConfig.action,
          outgoingFlows,
          config: {
            multiConditionalPath: multiConditionalPathAction,
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
      outputParameterValues: {},
      overriddenOutgoingFlows: [
        {
          sourceHandle: 'A',
          sourceId: '123',
          sourceType: 'MULTI_CONDITIONAL_PATH',
          targetHandle: 'A',
          targetId: '321',
          targetType: 'REST',
        },
      ],
    });

    expect(isAPathValidSpy).toHaveBeenCalledWith('AND', [true, true]);
    expect(getExpressionResultSpy).toHaveBeenCalledTimes(1);
    expect(getExpressionResultSpy).toHaveBeenCalledWith(
      multiConditionalPathAction.flowHandleConditionalPath['A']?.groups,
      {
        leftExpression1: 'value1',
        leftExpression2: 'value1',
        aaaa: '9',
        bbbb: '1',
      },
      '141413123123',
      '57567567',
      '123'
    );
  });
});
