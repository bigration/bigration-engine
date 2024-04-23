import {
  ConditionalPathActionTypeEnum,
  Expression,
  ExpressionOperatorEnum,
} from '@bigration/studio-api-interface';

import { INSTANCE_LOG_KEYS } from '../../constants';
import { inputValueParser, ParseResults } from '../../utils/';
import { logEvent } from '../../logger';

export function executeExpression(
  operator: ExpressionOperatorEnum,
  parseLeftSide: ParseResults,
  parseRightSide: ParseResults
): boolean {
  function checkNumberComparison(operator: string): boolean {
    return (
      parseLeftSide.number !== undefined &&
      parseRightSide.number !== undefined &&
      evaluateComparison(operator, parseLeftSide.number, parseRightSide.number)
    );
  }

  function checkArrayComparison(operator: string): boolean {
    return (
      parseLeftSide.array !== undefined &&
      parseRightSide.array !== undefined &&
      evaluateComparison(operator, parseLeftSide.array, parseRightSide.array)
    );
  }

  function checkObjectComparison(operator: string) {
    return (
      parseLeftSide.object !== undefined &&
      parseRightSide.object !== undefined &&
      evaluateComparison(operator, parseLeftSide.object, parseRightSide.object)
    );
  }

  function evaluateComparison(
    operator: string,
    leftValue: string | number | object,
    rightValue: string | number | object
  ) {
    switch (operator) {
      case 'EQUALS':
        return leftValue === rightValue;
      case 'NOT_EQUALS':
        return leftValue !== rightValue;
      case 'GREATER_THAN':
        return leftValue > rightValue;
      case 'GREATER_THAN_EQUALS':
        return leftValue >= rightValue;
      case 'LESS_THAN':
        return leftValue < rightValue;
      case 'LESS_THAN_EQUALS':
        return leftValue <= rightValue;
      default:
        throw new Error('Invalid comparison operator');
    }
  }

  switch (operator) {
    case 'IS_NOT_NULL_OR_NOT_EMPTY':
      return (
        parseLeftSide.parsedValue !== null &&
        parseLeftSide.parsedValue !== undefined
      );
    case 'IS_NULL_OR_EMPTY':
      return (
        parseLeftSide.parsedValue === null ||
        parseLeftSide.parsedValue === undefined ||
        parseLeftSide.parsedValue === ''
      );
    case 'EQUALS':
      return (
        checkNumberComparison('EQUALS') ||
        checkArrayComparison('EQUALS') ||
        checkObjectComparison('EQUALS') ||
        parseLeftSide.parsedValue === parseRightSide.parsedValue
      );
    case 'NOT_EQUALS':
      return (
        checkNumberComparison('NOT_EQUALS') ||
        checkArrayComparison('NOT_EQUALS') ||
        checkObjectComparison('NOT_EQUALS') ||
        parseLeftSide.parsedValue !== parseRightSide.parsedValue
      );
    case 'GREATER_THAN':
      return (
        checkNumberComparison('GREATER_THAN') ||
        checkArrayComparison('GREATER_THAN') ||
        (parseLeftSide.parsedValue !== undefined &&
          parseRightSide.parsedValue !== undefined &&
          parseLeftSide.parsedValue > parseRightSide.parsedValue)
      );
    case 'GREATER_THAN_EQUALS':
      return (
        checkNumberComparison('GREATER_THAN_EQUALS') ||
        checkArrayComparison('GREATER_THAN_EQUALS') ||
        (parseLeftSide.parsedValue !== undefined &&
          parseRightSide.parsedValue !== undefined &&
          parseLeftSide.parsedValue >= parseRightSide.parsedValue)
      );
    case 'LESS_THAN':
      return (
        checkNumberComparison('LESS_THAN') ||
        checkArrayComparison('LESS_THAN') ||
        (parseLeftSide.parsedValue !== undefined &&
          parseRightSide.parsedValue !== undefined &&
          parseLeftSide.parsedValue < parseRightSide.parsedValue)
      );
    case 'LESS_THAN_EQUALS':
      return (
        checkNumberComparison('LESS_THAN_EQUALS') ||
        checkArrayComparison('LESS_THAN_EQUALS') ||
        (parseLeftSide.parsedValue !== undefined &&
          parseRightSide.parsedValue !== undefined &&
          parseLeftSide.parsedValue <= parseRightSide.parsedValue)
      );
    case 'CONTAINS':
      if (
        parseLeftSide.array !== undefined &&
        parseRightSide.array !== undefined
      ) {
        return parseLeftSide.array.includes(parseRightSide.array);
      }
      return (
        parseLeftSide.parsedValue !== undefined &&
        parseRightSide.parsedValue !== undefined &&
        parseLeftSide.parsedValue.includes(parseRightSide.parsedValue)
      );
    default:
      throw new Error('Expression not found');
  }
}

export function isAPathValid(
  type: ConditionalPathActionTypeEnum,
  expressionResults: Array<unknown>
): boolean {
  if (type === 'AND') {
    return !expressionResults.includes(false);
  }

  // handle OR
  return expressionResults.includes(true);
}

export function getExpressionResult(
  groups: Array<Expression>,
  inputParameterValues: Record<string, unknown>,
  instanceId: string,
  sourceId: string,
  targetId: string
) {
  const expressionResults = groups.map((expression) => {
    const parsedLeftSide = inputValueParser(
      inputParameterValues,
      expression.leftSide
    );

    const parsedRightSide =
      expression.operator !== 'IS_NOT_NULL_OR_NOT_EMPTY' &&
      expression.operator !== 'IS_NULL_OR_EMPTY'
        ? inputValueParser(inputParameterValues, expression.rightSide)
        : {};
    const results = executeExpression(
      expression.operator,
      parsedLeftSide,
      parsedRightSide
    );

    logEvent({
      instanceId,
      sourceId,
      targetId: targetId,
      logKey: INSTANCE_LOG_KEYS.CONDITIONAL_PATH_EXPRESSION_RESULT,
      logVars: {
        parsedLeftSide: parsedLeftSide?.parsedValue,
        parsedRightSide: parsedRightSide?.parsedValue,
        operator: expression.operator,
        results,
      },
    });

    return results;
  });
  return expressionResults;
}
