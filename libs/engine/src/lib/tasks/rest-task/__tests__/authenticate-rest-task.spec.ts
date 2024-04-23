import {
  handleBaseAuth,
  handleBearerToken,
  handleOAuth1,
  handleOAuth20,
} from '../authenticate-rest-task';
import { AxiosHeaders, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const defaultRestConfig: AxiosRequestConfig = {
  url: 'http://hello.com',
  method: 'POST',
  data: 'HI',
  headers: {
    Authorization: 'Bearer shit',
  } as unknown as AxiosRequestHeaders,
  timeout: 5000,
};

describe('authenticate-rest-task.spec', () => {
  jest.setTimeout(10000);

  it('handleBaseAuth ok', async () => {
    const restConfig = { ...defaultRestConfig };

    handleBaseAuth({
      restConfig: restConfig,
      baseAuth: { userName: 'hi', password: { decryptedValue: 'welt' } },
    });

    expect(restConfig).toEqual({
      ...defaultRestConfig,
      auth: { username: 'hi', password: 'welt' },
    });
  });

  it('handleBaseAuth throws error on baseAuthMissing', async () => {
    const restConfig = { ...defaultRestConfig };

    expect(() =>
      handleBaseAuth({
        restConfig: restConfig,
      })
    ).toThrow(Error);
  });

  it('handleBearerToken ok', async () => {
    const restConfig = { ...defaultRestConfig };

    handleBearerToken({
      restConfig: restConfig,
      bearer: '42342384923784137982423',
    });

    expect(restConfig).toEqual({
      data: 'HI',
      headers: { Authorization: 'Bearer 42342384923784137982423' },
      method: 'POST',
      timeout: 5000,
      url: 'http://hello.com',
    });
  });

  it('handleOAuth1 ok', async () => {
    const restConfig: AxiosRequestConfig = {
      url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
      method: 'GET',
      data: undefined,
      headers: undefined,
    };

    handleOAuth1({
      restConfig: restConfig,
      oauth1: {
        consumerKey: 'iDzrXmipsD1B2toSD2E9KdqHd',
        consumerSecret: {
          decryptedValue: 'pxfw4sYFVY6EdHfJvy9lssfjliMgg6hpEThY5DMBCycFrrflB7',
        },
        accessToken: {
          decryptedValue: '969524492589584385-cG0fxOOxl4FzhII6PbCDOzrMKUJauWj',
        },
        tokenSecret: {
          decryptedValue: '7Gc8n0xUFerMx3Bh5x7JfFQI4KstmXQmoVioPa88T9oN4',
        },
        signatureMethod: 'HMAC-SHA1',
      },
    });

    const headers: AxiosHeaders = restConfig.headers as AxiosHeaders;

    expect(headers['Authorization']).toContain(
      'OAuth oauth_consumer_key="iDzrXmipsD1B2toSD2E9KdqHd"'
    );

    expect(headers['Authorization']).toContain(
      'oauth_signature_method="HMAC-SHA1"'
    );
  });

  it('handleOAuth2 client credentials header ok', async () => {
    const restConfig: AxiosRequestConfig = {
      url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
      method: 'GET',
      data: undefined,
      headers: undefined,
    };

    await handleOAuth20({
      restConfig: restConfig,
      oAuth2: {
        clientAuth: 'HEADER',
        type: 'CLIENT_CREDENTIALS',
        accessTokenUrl:
          'https://auth.bigration.com/realms/bigration-dev/protocol/openid-connect/token',
        clientId: 'test-oauth2',
        clientSecret: {
          decryptedValue: '0nnZqUi0U8RiA6uiRVveT3pI2eG4HqAv',
        },
        scope: 'profile',
      },
    });

    const headers1 = restConfig.headers as AxiosHeaders;
    expect(headers1['Authorization']).toContain('Bearer ');
  });

  it('handleOAuth2 password credentials header ok', async () => {
    const restConfig: AxiosRequestConfig = {
      url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
      method: 'GET',
      data: undefined,
      headers: undefined,
    };

    await handleOAuth20({
      restConfig: restConfig,
      oAuth2: {
        clientAuth: 'HEADER',
        type: 'PASSWORD_CREDENTIALS',
        accessTokenUrl:
          'https://auth.bigration.com/realms/bigration-dev/protocol/openid-connect/token',
        clientId: 'test-oauth2-user-pwd',
        userName: 'bibi1@bibi.com',
        password: {
          decryptedValue: 'bibibibi',
        },
      },
    });

    const headers2 = restConfig.headers as AxiosHeaders;
    expect(headers2['Authorization']).toContain('Bearer ');
  });

  it('handleOAuth2 password credentials body ok', async () => {
    const restConfig: AxiosRequestConfig = {
      url: 'https://api.twitter.com/1.1/statuses/home_timeline.json',
      method: 'GET',
      data: undefined,
      headers: undefined,
    };

    await handleOAuth20({
      restConfig: restConfig,
      oAuth2: {
        clientAuth: 'BODY',
        type: 'PASSWORD_CREDENTIALS',
        accessTokenUrl:
          'https://auth.bigration.com/realms/bigration-dev/protocol/openid-connect/token',
        clientId: 'test-oauth2-user-pwd',
        userName: 'bibi1@bibi.com',
        password: {
          decryptedValue: 'bibibibi',
        },
      },
    });

    const headers3 = restConfig.headers as AxiosHeaders;
    expect(headers3['Authorization']).toContain('Bearer ');
  });
});
