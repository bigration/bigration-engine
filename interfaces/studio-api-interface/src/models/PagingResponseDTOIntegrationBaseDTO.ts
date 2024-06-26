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
import type { IntegrationBaseDTO } from './IntegrationBaseDTO';
import {
    IntegrationBaseDTOFromJSON,
    IntegrationBaseDTOFromJSONTyped,
    IntegrationBaseDTOToJSON,
} from './IntegrationBaseDTO';

/**
 * 
 * @export
 * @interface PagingResponseDTOIntegrationBaseDTO
 */
export interface PagingResponseDTOIntegrationBaseDTO {
    /**
     * 
     * @type {Array<IntegrationBaseDTO>}
     * @memberof PagingResponseDTOIntegrationBaseDTO
     */
    response: Array<IntegrationBaseDTO>;
    /**
     * 
     * @type {number}
     * @memberof PagingResponseDTOIntegrationBaseDTO
     */
    total: number;
    /**
     * 
     * @type {boolean}
     * @memberof PagingResponseDTOIntegrationBaseDTO
     */
    hasNext: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PagingResponseDTOIntegrationBaseDTO
     */
    hasPrevious: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PagingResponseDTOIntegrationBaseDTO
     */
    hasContent: boolean;
}

/**
 * Check if a given object implements the PagingResponseDTOIntegrationBaseDTO interface.
 */
export function instanceOfPagingResponseDTOIntegrationBaseDTO(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "response" in value;
    isInstance = isInstance && "total" in value;
    isInstance = isInstance && "hasNext" in value;
    isInstance = isInstance && "hasPrevious" in value;
    isInstance = isInstance && "hasContent" in value;

    return isInstance;
}

export function PagingResponseDTOIntegrationBaseDTOFromJSON(json: any): PagingResponseDTOIntegrationBaseDTO {
    return PagingResponseDTOIntegrationBaseDTOFromJSONTyped(json, false);
}

export function PagingResponseDTOIntegrationBaseDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): PagingResponseDTOIntegrationBaseDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'response': ((json['response'] as Array<any>).map(IntegrationBaseDTOFromJSON)),
        'total': json['total'],
        'hasNext': json['hasNext'],
        'hasPrevious': json['hasPrevious'],
        'hasContent': json['hasContent'],
    };
}

export function PagingResponseDTOIntegrationBaseDTOToJSON(value?: PagingResponseDTOIntegrationBaseDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'response': ((value.response as Array<any>).map(IntegrationBaseDTOToJSON)),
        'total': value.total,
        'hasNext': value.hasNext,
        'hasPrevious': value.hasPrevious,
        'hasContent': value.hasContent,
    };
}

