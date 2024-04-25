import {
  ConditionalPathAction,
  Expression,
} from '@bigration/studio-api-interface';
import { executeExpression, isAPathValid } from '../conditional-helpers';
import { ParseResults } from '../../../utils';

describe('consumer-loop-task', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('isAPathValid', () => {
    it('should return true when the conditional path type is "AND" and expression results include false', () => {
      const conditionalPath: ConditionalPathAction = {
        type: 'AND',
      };
      const expressionResults = [true, false, true];

      const result = isAPathValid(conditionalPath.type, expressionResults);

      expect(result).toBe(false);
    });

    it('should return false when the conditional path type is "AND" and expression results do not include false', () => {
      const conditionalPath: ConditionalPathAction = {
        type: 'AND',
      };
      const expressionResults = [true, true, true];

      const result = isAPathValid(conditionalPath.type, expressionResults);

      expect(result).toBe(true);
    });

    it('should return true when the conditional path type is "OR" and expression results include true', () => {
      const conditionalPath: ConditionalPathAction = {
        type: 'OR',
      };
      const expressionResults = [false, true, false];

      const result = isAPathValid(conditionalPath.type, expressionResults);

      expect(result).toBe(true);
    });

    it('should return false when the conditional path type is "OR" and expression results do not include true', () => {
      const conditionalPath: ConditionalPathAction = {
        type: 'OR',
      };
      const expressionResults = [false, false, false];

      const result = isAPathValid(conditionalPath.type, expressionResults);

      expect(result).toBe(false);
    });
  });

  describe('executeExpression', () => {
    it('should return true for IS_NOT_NULL_OR_NOT_EMPTY when left side is not null or undefined', () => {
      const expression = { operator: 'IS_NOT_NULL_OR_NOT_EMPTY' } as Expression;
      const parseLeftSide = { parsedValue: 'some value' };
      const parseRightSide = {};

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(true);
    });

    it('should return false for IS_NOT_NULL_OR_NOT_EMPTY when left side is null', () => {
      const expression = { operator: 'IS_NOT_NULL_OR_NOT_EMPTY' } as Expression;
      const parseLeftSide: ParseResults = { parsedValue: undefined };
      const parseRightSide: ParseResults = {};

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });

    it('should return true for IS_NULL_OR_EMPTY when right side is null', () => {
      const expression = { operator: 'IS_NULL_OR_EMPTY' } as Expression;
      const parseLeftSide: ParseResults = {};
      const parseRightSide: ParseResults = {};

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(true);
    });

    it('should return false for IS_NULL_OR_EMPTY when right side is not null or undefined', () => {
      const expression = { operator: 'IS_NULL_OR_EMPTY' } as Expression;
      const parseLeftSide: ParseResults = { parsedValue: 'some value' };
      const parseRightSide: ParseResults = {};

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });
    it('should return true for GREATER_THAN when left side number is greater than right side number', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { number: 5 };
      const parseRightSide = { number: 2 };

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(true);
    });

    it('should return false for GREATER_THAN when left side number is less than right side number', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { number: 2 };
      const parseRightSide = { number: 5 };

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });

    it('should return true for GREATER_THAN when left side array length is greater than right side array length', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { array: [1, 2, 3] };
      const parseRightSide = { array: [1, 2] };

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(true);
    });

    it('should return false for GREATER_THAN when left side array length is less than right side array length', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { array: [1, 2] };
      const parseRightSide = { array: [1, 2, 3] };

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });

    it('should return false for GREATER_THAN when left side object property count is less than right side object property count', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { object: { prop1: 'value1' } };
      const parseRightSide = { object: { prop1: 'value1', prop2: 'value2' } };

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });

    it('should return true for GREATER_THAN when left side parsedValue is greater than right side parsedValue', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { parsedValue: 5 } as unknown as ParseResults;
      const parseRightSide = { parsedValue: 2 } as unknown as ParseResults;

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(true);
    });

    it('should return false for GREATER_THAN when left side parsedValue is less than right side parsedValue', () => {
      const expression = { operator: 'GREATER_THAN' } as Expression;
      const parseLeftSide = { parsedValue: 2 } as unknown as ParseResults;
      const parseRightSide = { parsedValue: 5 } as unknown as ParseResults;

      const result = executeExpression(
        expression.operator,
        parseLeftSide,
        parseRightSide
      );

      expect(result).toBe(false);
    });
  });

  it('should return true for GREATER_THAN_EQUALS when left side number is greater than right side number', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { number: 5 } as unknown as ParseResults;
    const parseRightSide = { number: 2 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for GREATER_THAN_EQUALS when left side number is less than right side number', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { number: 2 } as unknown as ParseResults;
    const parseRightSide = { number: 5 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });

  it('should return true for GREATER_THAN_EQUALS when left side array length is greater than right side array length', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { array: [1, 2, 3] } as unknown as ParseResults;
    const parseRightSide = { array: [1, 2] } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for GREATER_THAN_EQUALS when left side array length is less than right side array length', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { array: [1, 2] } as unknown as ParseResults;
    const parseRightSide = { array: [1, 2, 3] } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });

  it('should return true for GREATER_THAN_EQUALS when left side parsedValue is greater than right side parsedValue', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { parsedValue: 5 } as unknown as ParseResults;
    const parseRightSide = { parsedValue: 2 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for GREATER_THAN_EQUALS when left side parsedValue is less than right side parsedValue', () => {
    const expression = { operator: 'GREATER_THAN_EQUALS' } as Expression;
    const parseLeftSide = { parsedValue: 2 } as unknown as ParseResults;
    const parseRightSide = { parsedValue: 5 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });
  it('should return true for LESS_THAN when left side number is less than right side number', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { number: 2 } as unknown as ParseResults;
    const parseRightSide = { number: 5 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for LESS_THAN when left side number is greater than right side number', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { number: 5 } as unknown as ParseResults;
    const parseRightSide = { number: 2 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });

  it('should return true for LESS_THAN when left side array length is less than right side array length', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { array: [1, 2] } as unknown as ParseResults;
    const parseRightSide = { array: [1, 2, 3] } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for LESS_THAN when left side array length is greater than right side array length', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { array: [1, 2, 3] } as unknown as ParseResults;
    const parseRightSide = { array: [1, 2] } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });

  it('should return true for LESS_THAN when left side parsedValue is less than right side parsedValue', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { parsedValue: 2 } as unknown as ParseResults;
    const parseRightSide = { parsedValue: 5 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });

  it('should return false for LESS_THAN when left side parsedValue is greater than right side parsedValue', () => {
    const expression = { operator: 'LESS_THAN' } as Expression;
    const parseLeftSide = { parsedValue: 5 } as unknown as ParseResults;
    const parseRightSide = { parsedValue: 2 } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(false);
  });

  it('should return true for CONTAINS when left side parsed value contains right side parsed value', () => {
    const expression = { operator: 'CONTAINS' } as Expression;
    const parseLeftSide = { parsedValue: 'abcdefg' } as unknown as ParseResults;
    const parseRightSide = { parsedValue: 'cde' } as unknown as ParseResults;

    const result = executeExpression(
      expression.operator,
      parseLeftSide,
      parseRightSide
    );

    expect(result).toBe(true);
  });
});
