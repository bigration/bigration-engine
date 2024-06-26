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
/**
 * 
 * @export
 * @interface FilterItem
 */
export interface FilterItem {
    /**
     * 
     * @type {number}
     * @memberof FilterItem
     */
    id?: number;
    /**
     * 
     * @type {string}
     * @memberof FilterItem
     */
    columnField: string;
    /**
     * 
     * @type {object}
     * @memberof FilterItem
     */
    value?: object;
    /**
     * 
     * @type {string}
     * @memberof FilterItem
     */
    operator: FilterItemOperatorEnum;
}


/**
 * @export
 */
export const FilterItemOperatorEnum = {
    CONTAINS: 'CONTAINS',
    EQUALS: 'EQUALS',
    STARTS_WITH: 'STARTS_WITH',
    ENDS_WITH: 'ENDS_WITH',
    NUMBER_EQUALS: 'NUMBER_EQUALS',
    NUMBER_STARTS_WITH: 'NUMBER_STARTS_WITH',
    MULTISELECT: 'MULTISELECT',
    DATE_RANGE: 'DATE_RANGE',
    NUMBER_RANGE: 'NUMBER_RANGE'
} as const;
export type FilterItemOperatorEnum = typeof FilterItemOperatorEnum[keyof typeof FilterItemOperatorEnum];


/**
 * Check if a given object implements the FilterItem interface.
 */
export function instanceOfFilterItem(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "columnField" in value;
    isInstance = isInstance && "operator" in value;

    return isInstance;
}

export function FilterItemFromJSON(json: any): FilterItem {
    return FilterItemFromJSONTyped(json, false);
}

export function FilterItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): FilterItem {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'columnField': json['columnField'],
        'value': !exists(json, 'value') ? undefined : json['value'],
        'operator': json['operator'],
    };
}

export function FilterItemToJSON(value?: FilterItem | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'columnField': value.columnField,
        'value': value.value,
        'operator': value.operator,
    };
}

