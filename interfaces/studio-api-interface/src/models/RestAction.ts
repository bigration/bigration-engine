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
import type { RestConfigEndpoint } from './RestConfigEndpoint';
import {
    RestConfigEndpointFromJSON,
    RestConfigEndpointFromJSONTyped,
    RestConfigEndpointToJSON,
} from './RestConfigEndpoint';

/**
 * 
 * @export
 * @interface RestAction
 */
export interface RestAction {
    /**
     * 
     * @type {RestConfigEndpoint}
     * @memberof RestAction
     */
    endpoint: RestConfigEndpoint;
    /**
     * 
     * @type {Array<KeyValueStringPair>}
     * @memberof RestAction
     */
    headers?: Array<KeyValueStringPair>;
    /**
     * 
     * @type {string}
     * @memberof RestAction
     */
    body?: string;
}

/**
 * Check if a given object implements the RestAction interface.
 */
export function instanceOfRestAction(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "endpoint" in value;

    return isInstance;
}

export function RestActionFromJSON(json: any): RestAction {
    return RestActionFromJSONTyped(json, false);
}

export function RestActionFromJSONTyped(json: any, ignoreDiscriminator: boolean): RestAction {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'endpoint': RestConfigEndpointFromJSON(json['endpoint']),
        'headers': !exists(json, 'headers') ? undefined : ((json['headers'] as Array<any>).map(KeyValueStringPairFromJSON)),
        'body': !exists(json, 'body') ? undefined : json['body'],
    };
}

export function RestActionToJSON(value?: RestAction | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'endpoint': RestConfigEndpointToJSON(value.endpoint),
        'headers': value.headers === undefined ? undefined : ((value.headers as Array<any>).map(KeyValueStringPairToJSON)),
        'body': value.body,
    };
}

