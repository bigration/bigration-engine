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
 * @interface WorkflowEditDTO
 */
export interface WorkflowEditDTO {
    /**
     * 
     * @type {string}
     * @memberof WorkflowEditDTO
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowEditDTO
     */
    projectId: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowEditDTO
     */
    region: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowEditDTO
     */
    workflowTemplateId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof WorkflowEditDTO
     */
    privateTemplate?: boolean;
    /**
     * 
     * @type {number}
     * @memberof WorkflowEditDTO
     */
    rotationPeriod: number;
}

/**
 * Check if a given object implements the WorkflowEditDTO interface.
 */
export function instanceOfWorkflowEditDTO(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "projectId" in value;
    isInstance = isInstance && "region" in value;
    isInstance = isInstance && "rotationPeriod" in value;

    return isInstance;
}

export function WorkflowEditDTOFromJSON(json: any): WorkflowEditDTO {
    return WorkflowEditDTOFromJSONTyped(json, false);
}

export function WorkflowEditDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkflowEditDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'name': json['name'],
        'projectId': json['projectId'],
        'region': json['region'],
        'workflowTemplateId': !exists(json, 'workflowTemplateId') ? undefined : json['workflowTemplateId'],
        'privateTemplate': !exists(json, 'privateTemplate') ? undefined : json['privateTemplate'],
        'rotationPeriod': json['rotationPeriod'],
    };
}

export function WorkflowEditDTOToJSON(value?: WorkflowEditDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'name': value.name,
        'projectId': value.projectId,
        'region': value.region,
        'workflowTemplateId': value.workflowTemplateId,
        'privateTemplate': value.privateTemplate,
        'rotationPeriod': value.rotationPeriod,
    };
}

