import { KeyValueStringPair } from '@bigration/studio-api-interface';
import { inputValueParser } from '../utils';

export function keyValueParser(
  headers: Array<KeyValueStringPair>,
  inputParameterValues: Record<string, unknown>
) {
  return headers.reduce(function (map: Record<string, unknown>, obj) {
    const parsedKey = inputValueParser(
      inputParameterValues,
      obj.key
    ).parsedValue;
    const parsedValue = inputValueParser(
      inputParameterValues,
      obj.value
    ).parsedValue;

    if (parsedKey) {
      map[parsedKey] = parsedValue;
    }
    return map;
  }, {});
}
