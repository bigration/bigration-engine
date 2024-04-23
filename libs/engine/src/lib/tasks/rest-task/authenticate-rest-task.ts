import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import {
  AuthenticationMethods,
  BasicAuth,
  OAuth1Auth,
  OAuth2Auth,
} from '@bigration/studio-api-interface';

import * as crypto from 'crypto';
import OAuth from 'oauth-1.0a';
import { ServiceRestClient } from '../../utils';

export const handleAuth = async ({
  restConfig,
  defaultAuthentication,
}: {
  restConfig: AxiosRequestConfig;
  defaultAuthentication?: AuthenticationMethods;
}) => {
  if (!defaultAuthentication) {
    return;
  }

  switch (defaultAuthentication.type) {
    case 'BEARER':
      handleBearerToken({
        restConfig,
        bearer: defaultAuthentication.bearerToken?.decryptedValue,
      });
      break;
    case 'BASIC':
      handleBaseAuth({
        restConfig,
        baseAuth: defaultAuthentication.basicAuth,
      });
      break;
    case 'OAUTH_2_0':
      await handleOAuth20({
        restConfig,
        oAuth2: defaultAuthentication.oauth2,
      });
      break;
    case 'OAUTH_1_0':
      if (!defaultAuthentication.oauth1) {
        throw new Error('Missing oauth1 configuration');
      }
      handleOAuth1({
        restConfig,
        oauth1: defaultAuthentication.oauth1,
      });
      break;
    default:
      break;
  }
};

export const handleBaseAuth = ({
  restConfig,
  baseAuth,
}: {
  restConfig: AxiosRequestConfig;
  baseAuth?: BasicAuth;
}): void => {
  if (!baseAuth) {
    throw Error('Missing base authentication configuration');
  }

  restConfig.auth = {
    username: baseAuth.userName,
    password: baseAuth.password?.decryptedValue || '',
  };
};

export function handleOAuth1({
  restConfig,
  oauth1,
}: {
  restConfig: AxiosRequestConfig;
  oauth1: OAuth1Auth;
}) {
  const oauthClient = new OAuth({
    consumer: {
      key: oauth1.consumerKey || '',
      secret: oauth1.consumerSecret?.decryptedValue || '',
    },
    signature_method: oauth1.signatureMethod,
    hash_function(base_string, key) {
      return crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64');
    },
  });

  if (!restConfig.url || !restConfig.method) {
    throw new Error('Missing url or method');
  }

  const requestData: OAuth.RequestOptions = {
    url: restConfig.url,
    method: restConfig.method,
    data: restConfig.data,
  };

  const authorizationHeader = oauthClient.toHeader(
    oauthClient.authorize(requestData, {
      key: oauth1.accessToken?.decryptedValue || '',
      secret: oauth1.tokenSecret?.decryptedValue || '',
    })
  );

  const currentHeaders = restConfig.headers || {};

  restConfig.headers = {
    ...currentHeaders,
    ...authorizationHeader,
  } as unknown as AxiosRequestHeaders;
}

export const handleBearerToken = ({
  restConfig,
  bearer,
}: {
  restConfig: AxiosRequestConfig;
  bearer?: string;
}): void => {
  const currentHeaders = restConfig.headers || {};
  restConfig.headers = {
    ...currentHeaders,
    Authorization: `Bearer ${bearer}`,
  } as unknown as AxiosRequestHeaders;
};

export const handleOAuth20 = async ({
  restConfig,
  oAuth2,
}: {
  restConfig: AxiosRequestConfig;
  oAuth2?: OAuth2Auth;
}): Promise<string> => {
  if (!oAuth2) {
    throw Error('Missing base authentication configuration');
  }

  const body: Record<string, unknown> = {
    scope: oAuth2.scope,
    grant_type:
      oAuth2.type === 'PASSWORD_CREDENTIALS'
        ? 'password'
        : 'client_credentials',
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const clientId = oAuth2.clientId;
  const clientSecret = oAuth2.clientSecret?.decryptedValue;

  if (oAuth2.clientAuth === 'HEADER') {
    const encoded = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString(
      'base64'
    );
    headers['Authorization'] = `Basic ${encoded}`;
  } else {
    body['client_id'] = clientId;
    body['client_secret'] = clientSecret;
  }

  if (oAuth2.type === 'PASSWORD_CREDENTIALS') {
    body['username'] = oAuth2.userName;
    body['password'] = oAuth2.password?.decryptedValue;
  }

  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: headers as unknown as AxiosRequestHeaders,
    url: oAuth2.accessTokenUrl,
    data: body,
  };

  const response = await ServiceRestClient(options);

  const { access_token } = response.data;

  const currentHeaders = restConfig.headers || {};

  restConfig.headers = {
    ...currentHeaders,
    Authorization: `Bearer ${access_token}`,
  } as unknown as AxiosRequestHeaders;
  return access_token;
};
