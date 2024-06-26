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
import type { GlobalVariableDTO } from './GlobalVariableDTO';
import {
    GlobalVariableDTOFromJSON,
    GlobalVariableDTOFromJSONTyped,
    GlobalVariableDTOToJSON,
} from './GlobalVariableDTO';
import type { WorkflowTemplate } from './WorkflowTemplate';
import {
    WorkflowTemplateFromJSON,
    WorkflowTemplateFromJSONTyped,
    WorkflowTemplateToJSON,
} from './WorkflowTemplate';

/**
 * 
 * @export
 * @interface WorkflowBaseDTO
 */
export interface WorkflowBaseDTO {
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    id: string;
    /**
     * 
     * @type {Date}
     * @memberof WorkflowBaseDTO
     */
    createdDate?: Date;
    /**
     * 
     * @type {Date}
     * @memberof WorkflowBaseDTO
     */
    modifiedDate?: Date;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    userName?: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    status: WorkflowBaseDTOStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    triggerType: WorkflowBaseDTOTriggerTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    projectId: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    projectName: string;
    /**
     * 
     * @type {string}
     * @memberof WorkflowBaseDTO
     */
    region: string;
    /**
     * 
     * @type {number}
     * @memberof WorkflowBaseDTO
     */
    rotationPeriod: number;
    /**
     * 
     * @type {Array<GlobalVariableDTO>}
     * @memberof WorkflowBaseDTO
     */
    globalVariables: Array<GlobalVariableDTO>;
    /**
     * 
     * @type {WorkflowTemplate}
     * @memberof WorkflowBaseDTO
     */
    template?: WorkflowTemplate;
}


/**
 * @export
 */
export const WorkflowBaseDTOStatusEnum = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
} as const;
export type WorkflowBaseDTOStatusEnum = typeof WorkflowBaseDTOStatusEnum[keyof typeof WorkflowBaseDTOStatusEnum];

/**
 * @export
 */
export const WorkflowBaseDTOTriggerTypeEnum = {
    WEBHOOK: 'WEBHOOK',
    MANUAL: 'MANUAL',
    CRON_JOB: 'CRON_JOB'
} as const;
export type WorkflowBaseDTOTriggerTypeEnum = typeof WorkflowBaseDTOTriggerTypeEnum[keyof typeof WorkflowBaseDTOTriggerTypeEnum];


/**
 * Check if a given object implements the WorkflowBaseDTO interface.
 */
export function instanceOfWorkflowBaseDTO(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "name" in value;
    isInstance = isInstance && "status" in value;
    isInstance = isInstance && "triggerType" in value;
    isInstance = isInstance && "projectId" in value;
    isInstance = isInstance && "projectName" in value;
    isInstance = isInstance && "region" in value;
    isInstance = isInstance && "rotationPeriod" in value;
    isInstance = isInstance && "globalVariables" in value;

    return isInstance;
}

export function WorkflowBaseDTOFromJSON(json: any): WorkflowBaseDTO {
    return WorkflowBaseDTOFromJSONTyped(json, false);
}

export function WorkflowBaseDTOFromJSONTyped(json: any, ignoreDiscriminator: boolean): WorkflowBaseDTO {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'createdDate': !exists(json, 'createdDate') ? undefined : (new Date(json['createdDate'])),
        'modifiedDate': !exists(json, 'modifiedDate') ? undefined : (new Date(json['modifiedDate'])),
        'userName': !exists(json, 'userName') ? undefined : json['userName'],
        'userId': !exists(json, 'userId') ? undefined : json['userId'],
        'name': json['name'],
        'status': json['status'],
        'triggerType': json['triggerType'],
        'projectId': json['projectId'],
        'projectName': json['projectName'],
        'region': json['region'],
        'rotationPeriod': json['rotationPeriod'],
        'globalVariables': ((json['globalVariables'] as Array<any>).map(GlobalVariableDTOFromJSON)),
        'template': !exists(json, 'template') ? undefined : WorkflowTemplateFromJSON(json['template']),
    };
}

export function WorkflowBaseDTOToJSON(value?: WorkflowBaseDTO | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'createdDate': value.createdDate === undefined ? undefined : (value.createdDate.toISOString()),
        'modifiedDate': value.modifiedDate === undefined ? undefined : (value.modifiedDate.toISOString()),
        'userName': value.userName,
        'userId': value.userId,
        'name': value.name,
        'status': value.status,
        'triggerType': value.triggerType,
        'projectId': value.projectId,
        'projectName': value.projectName,
        'region': value.region,
        'rotationPeriod': value.rotationPeriod,
        'globalVariables': ((value.globalVariables as Array<any>).map(GlobalVariableDTOToJSON)),
        'template': WorkflowTemplateToJSON(value.template),
    };
}

