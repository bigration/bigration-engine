import { templateRenderObject } from './template-render-object';
import { get } from 'lodash';
import { CustomWorkflowError } from '../common';
import { jsonStringify } from './json-utils';
import { INSTANCE_LOG_KEYS } from '../constants';

export type ParseResults = {
  array?: unknown[];
  object?: object;
  number?: number;
  boolean?: boolean;
  parsedValue?: string;
};

function validateObjectForReservedWords(obj: Record<string, unknown>) {
  const handlebarsReservedWords =
    /\b(blockParams|@data|else|each|if|unless|with|log|test)\b/;
  const mustacheReservedWords =
    /\b(name|index|key|first|last|even|odd|length)\b/;

  for (const [key] of Object.entries(obj)) {
    if (handlebarsReservedWords.test(key) || mustacheReservedWords.test(key)) {
      throw new CustomWorkflowError({
        logKey: INSTANCE_LOG_KEYS.ERROR_INPUT_VALUE_HAS_RESERVED_WORD,
        logVars: {
          key,
          reserved:
            'blockParams|@data|else|each|if|unless|with|log|test|name|index|key|first|last|even|odd|length',
        },
      });
    }
  }
}

export function getSingleValueFromParseResult(
  parsed: ParseResults
): object | unknown[] | number | boolean | string | undefined {
  if (parsed.array) {
    return parsed.array;
  }
  if (parsed.object) {
    return parsed.object;
  }
  if (parsed.number !== undefined) {
    return parsed.number;
  }
  if (parsed.boolean !== undefined) {
    return parsed.boolean;
  }
  return parsed.parsedValue;
}

export const getValueFromInputWithoutTemplateParsing = (
  inputParameterValues: Record<string, unknown> | object | undefined,
  searchParam?: string
): ParseResults => {
  const result = get(inputParameterValues || {}, searchParam || '');
  return parseString(result);
};

export function getParsedValue(valueToParse: unknown) {
  try {
    return parseJson((valueToParse as string) || '');
  } catch (err) {
    return parseString(valueToParse || '');
  }
}

export function inputValueParser(
  inputParameterValues: Record<string, unknown>,
  inputString?: string
): ParseResults {
  if (!inputString) {
    return {};
  }

  validateObjectForReservedWords(inputParameterValues);

  const parsedValue = templateRenderObject(inputParameterValues, inputString);
  return getParsedValue(parsedValue);
}

export function parseString(value: unknown): ParseResults {
  //check if array
  if (Array.isArray(value)) {
    return { parsedValue: jsonStringify(value), array: value };
  }

  // check if boolean
  if (typeof value === 'boolean') {
    return { parsedValue: value.toString(), boolean: value };
  }

  // check if object
  if (typeof value === 'object' && value !== null) {
    return { parsedValue: jsonStringify(value), object: value };
  }

  // check if null
  if (value === null) {
    return { parsedValue: 'null' };
  }

  // check if number
  if (!isNaN(Number(value))) {
    const number = Number(value);
    return { parsedValue: number.toString(), number };
  }

  const parsedValue = value?.toString() || '';
  const parse: ParseResults = { parsedValue };

  if (parsedValue.startsWith('[') && parsedValue.endsWith(']')) {
    try {
      const array = JSON.parse(parsedValue);
      return { ...parse, array };
    } catch (err) {
      return parse;
    }
  }

  if (parsedValue.startsWith('{') && parsedValue.endsWith('}')) {
    try {
      const object = JSON.parse(parsedValue);
      return { ...parse, object };
    } catch (err) {
      return parse;
    }
  }

  if (!isNaN(Number(parsedValue))) {
    const number = Number(parsedValue);
    return { ...parse, number };
  }

  if (!isNaN(Number(parsedValue))) {
    const number = Number(parsedValue);
    return { ...parse, number: number };
  }

  return parse;
}

export function parseJson(parsedValue: string): ParseResults {
  const parse: ParseResults = { parsedValue };

  const [, result] = [null, JSON.parse(parsedValue)];
  const type = Object.prototype.toString.call(result);

  if (type === '[object Object]') {
    return { ...parse, object: result };
  }

  if (type === '[object Array]') {
    return { ...parse, array: result };
  }

  if (typeof result === 'number' && !isNaN(result)) {
    return { ...parse, number: result };
  }

  if (typeof result === 'string' && !isNaN(Number(result))) {
    const number = Number(result);
    return { ...parse, number: number };
  }

  return parse;
}
