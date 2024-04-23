import { initCache, initNewInstanceRunCache } from '../../cache';
import { MessageActionFlowType } from '../../types/message-action-flow-type';
import {
  getInputFromGlobalVariables,
  getInputFromInstance,
  getInputFromInstanceActions,
} from '../handle-action-input';
import {
  InputParameter,
  InstanceActionModel,
  InstanceEngineMessageDTO,
} from '@bigration/studio-api-interface';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

jest.mock('../../logger', () => {
  const originalModule = jest.requireActual('../../logger');
  return {
    ...originalModule,
    logEvent: jest.fn().mockReturnValue('works!'),
  };
});

describe('hande action input', () => {
  it('getInputFromInstance', async () => {
    await initCache();

    const messageAction: MessageActionFlowType = {
      actionType: 'TELEGRAM',
      sourceId: '78878',
      targetId: '123',
      instanceId: '321',
    };

    const inputParameters: Array<InputParameter> = [
      {
        source: 'TRIGGER',
        parameterName: 'custom_param',
        path: 'query.hello',
        defaultValue: '',
      },
      {
        source: 'ACTION',
        parameterName: 'query',
        path: 'query.hello',
        sourceActionId: '123',
        defaultValue: '',
      },
    ];

    const defaultInstanceAction: InstanceActionModel = {
      id: '23123123',
      action: {
        name: 'rest test',
        type: 'REST',
        inputParameters: [],
        outgoingFlows: [],
        workflowId: '1',
        workspaceId: '2',
        config: {
          rest: {
            endpoint: {
              method: 'GET',
              url: '/products/1',
            },
          },
        },
      },
      inputValues: {},
      instanceId: '',
      status: 'READY',
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',
        fetchedIntegrations: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        outputValues: output,
      },
      instanceActions: {
        [defaultInstanceAction.id as string]: defaultInstanceAction,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const results = await getInputFromInstance(messageAction, inputParameters);

    expect(results).toMatchObject({ custom_param: '123' });
  });

  it('getInputFromGlobalVariables', async () => {
    await initCache();

    const messageAction: MessageActionFlowType = {
      actionType: 'TELEGRAM',
      sourceId: '78878',
      targetId: '123',
      instanceId: '321',
    };

    const inputParameters: Array<InputParameter> = [
      {
        source: 'GLOBAL_VARIABLE',
        parameterName: 'custom_param',
        defaultValue: '',
      },
      {
        source: 'GLOBAL_VARIABLE',
        parameterName: 'custom_paramNested',
        path: 'im.nested',
        defaultValue: '',
      },
    ];

    const defaultInstanceAction: InstanceActionModel = {
      id: '23123123',
      action: {
        name: 'rest test',
        type: 'REST',
        inputParameters: [],
        outgoingFlows: [],
        workflowId: '1',
        workspaceId: '2',
        config: {
          rest: {
            endpoint: {
              method: 'GET',
              url: '/products/1',
            },
          },
        },
      },
      inputValues: {},
      instanceId: '',
      status: 'READY',
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',
        fetchedIntegrations: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        outputValues: output,
        globalVariables: {
          custom_param: {
            key: 'custom_param',
            value: '123',
          },
          im: {
            key: 'im',
            value: {
              nested: { bla: true },
            } as unknown as string,
          },
        },
      },
      instanceActions: {
        [defaultInstanceAction.id as string]: defaultInstanceAction,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const results = await getInputFromGlobalVariables(
      messageAction,
      inputParameters
    );

    expect(results).toMatchObject({
      custom_param: '123',
      custom_paramNested: {
        bla: true,
      },
    });
  });

  it('getInputFromActions', async () => {
    await initCache();
    const sourceActionId = '6348acd2e1a47ca32e79f46f';

    const messageAction: MessageActionFlowType = {
      actionType: 'TELEGRAM',
      sourceId: sourceActionId,
      targetId: '123',
      instanceId: '321',
    };

    const inputParameters: Array<InputParameter> = [
      {
        source: 'ACTION',
        sourceActionId: sourceActionId,
        parameterName: 'custom_param',
        path: 'params.workflowId',
        defaultValue: '',
      },
      {
        source: 'TRIGGER',
        parameterName: 'custom_param2',
        path: 'query.workflowId',
        defaultValue: '',
      },
      {
        source: 'ACTION',
        parameterName: 'query',
        path: 'query.hello',
        sourceActionId: '123',
        defaultValue: '',
      },
    ];

    const defaultInstanceAction: InstanceActionModel = {
      id: sourceActionId,
      outputValues: output,
      action: {
        id: sourceActionId,
        name: 'rest test',
        type: 'TELEGRAM',
        inputParameters: [],
        outgoingFlows: [],
        workflowId: '1',
        workspaceId: '2',
        config: {
          rest: {
            endpoint: {
              method: 'GET',
              url: '/products/1',
            },
          },
        },
      },
      inputValues: {},
      instanceId: '',
      status: 'READY',
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '321',
        status: 'READY',
        fetchedIntegrations: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        outputValues: output,
      },
      instanceActions: {
        [defaultInstanceAction.id as string]: defaultInstanceAction,
      },
    };

    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const results = await getInputFromInstanceActions(
      messageAction,
      inputParameters
    );

    expect(results).toMatchObject({ custom_param: '63cfd45cbcd1b561d47cf432' });
  });
});

const output = {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'user-agent': 'PostmanRuntime/7.30.1',
    accept: '*/*',
    'postman-token': '80ae811e-a919-4554-a8f8-f5b064d04a17',
    host: 'localhost:3333',
    'accept-encoding': 'gzip, deflate, br',
    connection: 'keep-alive',
    'content-length': '18',
  },
  query: {
    hello: '123',
  },
  params: {
    workflowId: '63cfd45cbcd1b561d47cf432',
  },
  body: {
    hi: 'im',
  },
  socket: {
    connecting: false,
    _hadError: false,
    _parent: null,
    _host: null,
    _closeAfterHandlingError: false,
    _readableState: {
      objectMode: false,
      highWaterMark: 16384,
      buffer: {
        head: null,
        tail: null,
        length: 0,
      },
      length: 0,
      pipes: [],
      flowing: true,
      ended: false,
      endEmitted: false,
      reading: true,
      constructed: true,
      sync: false,
      needReadable: true,
      emittedReadable: false,
      readableListening: false,
      resumeScheduled: false,
      errorEmitted: false,
      emitClose: false,
      autoDestroy: true,
      destroyed: false,
      errored: null,
      closed: false,
      closeEmitted: false,
      defaultEncoding: 'utf8',
      awaitDrainWriters: null,
      multiAwaitDrain: false,
      readingMore: false,
      dataEmitted: false,
      decoder: null,
      encoding: null,
    },
    _events: {
      end: [null, null],
      close: [null, null],
    },
    _eventsCount: 8,
    _writableState: {
      objectMode: false,
      highWaterMark: 16384,
      finalCalled: false,
      needDrain: false,
      ending: false,
      ended: false,
      finished: false,
      destroyed: false,
      decodeStrings: false,
      defaultEncoding: 'utf8',
      length: 0,
      writing: false,
      corked: 0,
      sync: true,
      bufferProcessing: false,
      writecb: null,
      writelen: 0,
      afterWriteTickInfo: null,
      buffered: [],
      bufferedIndex: 0,
      allBuffers: true,
      allNoop: true,
      pendingcb: 0,
      constructed: true,
      prefinished: false,
      errorEmitted: false,
      emitClose: false,
      autoDestroy: true,
      errored: null,
      closed: false,
      closeEmitted: false,
    },
    allowHalfOpen: true,
    _sockname: null,
    _pendingData: null,
    _pendingEncoding: '',
    server: {
      _events: {},
      _eventsCount: 3,
      _connections: 1,
      _handle: {
        reading: false,
      },
      _usingWorkers: false,
      _workers: [],
      _unref: false,
      allowHalfOpen: true,
      pauseOnConnect: false,
      noDelay: false,
      keepAlive: false,
      keepAliveInitialDelay: 0,
      httpAllowHalfOpen: false,
      timeout: 0,
      keepAliveTimeout: 5000,
      maxHeadersCount: null,
      maxRequestsPerSocket: 0,
      headersTimeout: 60000,
      requestTimeout: 0,
      _connectionKey: '6::::3333',
    },
    parser: {
      _headers: [],
      _url: '',
      incoming: {
        _readableState: {
          objectMode: false,
          highWaterMark: 16384,
          buffer: {
            head: null,
            tail: null,
            length: 0,
          },
          length: 0,
          pipes: [],
          flowing: true,
          ended: true,
          endEmitted: true,
          reading: false,
          constructed: true,
          sync: false,
          needReadable: false,
          emittedReadable: false,
          readableListening: false,
          resumeScheduled: false,
          errorEmitted: false,
          emitClose: true,
          autoDestroy: true,
          destroyed: true,
          errored: null,
          closed: true,
          closeEmitted: true,
          defaultEncoding: 'utf8',
          awaitDrainWriters: null,
          multiAwaitDrain: false,
          readingMore: false,
          dataEmitted: true,
          decoder: null,
          encoding: null,
        },
        _events: {},
        _eventsCount: 1,
        httpVersionMajor: 1,
        httpVersionMinor: 1,
        httpVersion: '1.1',
        complete: true,
        rawHeaders: [
          'Content-Type',
          'application/json',
          'User-Agent',
          'PostmanRuntime/7.30.1',
          'Accept',
          '*/*',
          'Postman-Token',
          '80ae811e-a919-4554-a8f8-f5b064d04a17',
          'Host',
          'localhost:3333',
          'Accept-Encoding',
          'gzip, deflate, br',
          'Connection',
          'keep-alive',
          'Content-Length',
          '18',
        ],
        rawTrailers: [],
        aborted: false,
        upgrade: false,
        url: '/63cfd45cbcd1b561d47cf432?hello=123',
        method: 'POST',
        statusCode: null,
        statusMessage: null,
        _consuming: true,
        _dumped: false,
        baseUrl: '/webhook',
        originalUrl: '/webhook/63cfd45cbcd1b561d47cf432?hello=123',
        _parsedUrl: {
          protocol: null,
          slashes: null,
          auth: null,
          host: null,
          port: null,
          hostname: null,
          hash: null,
          search: '?hello=123',
          query: 'hello=123',
          pathname: '/63cfd45cbcd1b561d47cf432',
          path: '/63cfd45cbcd1b561d47cf432?hello=123',
          href: '/63cfd45cbcd1b561d47cf432?hello=123',
          _raw: '/63cfd45cbcd1b561d47cf432?hello=123',
        },
        res: {
          _events: {},
          _eventsCount: 1,
          outputData: [],
          outputSize: 0,
          writable: true,
          destroyed: false,
          _last: false,
          chunkedEncoding: false,
          shouldKeepAlive: true,
          maxRequestsOnConnectionReached: false,
          _defaultKeepAlive: true,
          useChunkedEncodingByDefault: true,
          sendDate: true,
          _removedConnection: false,
          _removedContLen: false,
          _removedTE: false,
          strictContentLength: false,
          _contentLength: null,
          _hasBody: true,
          _trailer: '',
          finished: false,
          _headerSent: false,
          _closed: false,
          _header: null,
          _keepAliveTimeout: 5000,
          _sent100: false,
          _expect_continue: false,
          _maxRequestsPerSocket: 0,
          locals: {},
        },
        _body: true,
        route: {
          path: '/:workflowId',
          stack: [
            {
              name: 'triggerWebhook',
              keys: [],
              regexp: {
                fast_star: false,
                fast_slash: false,
              },
              method: 'post',
            },
          ],
          methods: {
            post: true,
          },
        },
      },
      outgoing: null,
      maxHeaderPairs: 2000,
      _consumed: true,
    },
    _paused: false,
  },
  url: '/63cfd45cbcd1b561d47cf432?hello=123',
};
