/* tslint:disable */
/* eslint-disable */
/**
 * Bigration API
 * Bigration
 *
 * The version of the OpenAPI document: v0.0.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { KeyValueStringPair } from './KeyValueStringPair';
import {
    KeyValueStringPairFromJSON,
    KeyValueStringPairFromJSONTyped,
    KeyValueStringPairToJSON,
} from './KeyValueStringPair';

/**
 * 
 * @export
 * @interface LoggerAction
 */
export interface LoggerAction {
    /**
     * 
     * @type {boolean}
     * @memberof LoggerAction
     */
    tempVariables: boolean;
    /**
     * 
     * @type {Array<KeyValueStringPair>}
     * @memberof LoggerAction
     */
    inputsRender?: Array<KeyValueStringPair>;
}

/**
 * Check if a given object implements the LoggerAction interface.
 */
export function instanceOfLoggerAction(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "tempVariables" in value;

    return isInstance;
}

export function LoggerActionFromJSON(json: any): LoggerAction {
    return LoggerActionFromJSONTyped(json, false);
}

export function LoggerActionFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoggerAction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tempVariables': json['tempVariables'],
        'inputsRender': !exists(json, 'inputsRender') ? undefined : ((json['inputsRender'] as Array<any>).map(KeyValueStringPairFromJSON)),
    };
}

export function LoggerActionToJSON(value?: LoggerAction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tempVariables': value.tempVariables,
        'inputsRender': value.inputsRender === undefined ? undefined : ((value.inputsRender as Array<any>).map(KeyValueStringPairToJSON)),
    };
}

