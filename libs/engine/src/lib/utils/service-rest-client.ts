import axios, { AxiosInstance } from 'axios';
import { jsonStringify } from './json-utils';

export const ServiceRestClient: AxiosInstance = axios.create({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

ServiceRestClient.interceptors.request.use(
  function (config) {
    return config;
  },
  function (err) {
    return Promise.reject(err);
  }
);

ServiceRestClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (err) {
    if (err.response?.data) {
      return Promise.reject(jsonStringify(err.response.data));
    }

    if (err.message) {
      return Promise.reject(jsonStringify(err.message));
    }

    if (err.cause) {
      return Promise.reject(jsonStringify(err.cause));
    }

    if (err?.response) {
      return Promise.reject(jsonStringify(err.response));
    }

    return Promise.reject(jsonStringify(err));
  }
);

export default ServiceRestClient;
