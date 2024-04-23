import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import {
  InstanceActionModel,
  RestConfigEndpoint,
} from '@bigration/studio-api-interface';
import { handleAuth } from './authenticate-rest-task';
import { keyValueParser } from '../../utils/parsers';
import { INSTANCE_LOG_KEYS } from '../../constants';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { fetchIntegration } from '../../common';
import { ServiceRestClient, templateRenderObject } from '../../utils';
import { logEvent } from '../../logger';

export const consumerRestTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { rest } = config;

  const integration = await fetchIntegration(
    messageAction,
    action?.involvedIntegrationId
  );

  const restIntegration = integration?.rest;

  if (!restIntegration || !rest) {
    throw Error('Missing Rest configuration');
  }

  const endpoint: RestConfigEndpoint | undefined = rest?.endpoint;

  if (!integration.rest?.baseUrl || !endpoint) {
    throw Error('Missing Rest configuration');
  }

  const paramsUrl = templateRenderObject(inputParameterValues, endpoint.url);

  const parsedBody = templateRenderObject(inputParameterValues, rest?.body);

  const defaultHeaders = integration.rest?.defaultHeaders || [];
  const actionHeaders = rest?.headers || [];
  const mergedHeaders = keyValueParser(
    [...defaultHeaders, ...actionHeaders],
    inputParameterValues
  );

  const restConfig: AxiosRequestConfig = {
    url: restIntegration.baseUrl + paramsUrl,
    method: endpoint.method,
    data: parsedBody,
    headers: mergedHeaders as AxiosRequestHeaders,
    timeout: 30000,
  };

  await handleAuth({
    restConfig,
    defaultAuthentication: integration.rest.defaultAuthentication,
  });

  logEvent({
    instanceId,
    targetId,
    sourceId,
    logKey: INSTANCE_LOG_KEYS.REST_ENDPOINT_REQUEST_DATA,
    references: restConfig,
  });

  const response = await ServiceRestClient.request(restConfig);

  const { data, headers, status } = response;

  return {
    outputParameterValues: { data, headers, status },
  };
};
