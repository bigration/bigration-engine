import { consumerMailTask } from '../consumer-mail-task';
import {
  IcalAttachmentMethodEnum,
  InstanceActionModel,
  InstanceEngineMessageDTO,
  IntegrationModel,
  MailConfigurationOptions,
  MailConfigurationOptionsPriorityEnum,
} from '@bigration/studio-api-interface';
import * as nodemailer from 'nodemailer';
import { MessageActionFlowType } from '../../../types';
import { initCache, initNewInstanceRunCache } from '../../../cache';

const messageAction: MessageActionFlowType = {
  sourceId: '57567567',
  targetId: '123',
  instanceId: '141413123123',
  actionType: 'MAIL',
};

const defailtInstanceAction: InstanceActionModel = {
  id: messageAction.targetId,
  action: {
    name: 'loop test',
    type: 'MAIL',
    involvedIntegrationId: '777',
    inputParameters: [
      {
        parameterName: 'iterator',

        defaultValue: '3',
        source: 'TRIGGER',
      },
    ],
    outgoingFlows: [],
    workflowId: '1',
    workspaceId: '2',
    config: {
      mail: {
        mailOption: {
          from: 'from@me.com',
          to: 'you@hey.com',
          cc: '',
          bcc: '',
          replyTo: '',
          subject: 'Sample Email',
          text: '',
          html:
            '<!DOCTYPE html>\n' +
            '<html>\n' +
            '<body>\n' +
            '    hello im email \n' +
            '</body>\n' +
            '</html>\n',
          icalEvent: {
            content: undefined,
            method: IcalAttachmentMethodEnum.PUBLISH,
          },
          headers: [],
          encoding: 'utf-8',
          priority: MailConfigurationOptionsPriorityEnum.normal,
        },
      },
    },
  },
  inputValues: {},
  instanceId: '',
  status: 'RUNNING',
};

describe('consumer-mail-task', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await initCache();
  });

  it('email can be sent to user', async () => {
    const testAccount = await nodemailer.createTestAccount();

    const defaultIntegration: IntegrationModel = {
      id: '777',
      workspaceId: '1',
      name: 'name',
      type: 'EMAIL',
      mail: {
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        defaultAuthentication: {
          type: 'BASIC',
          basicAuth: {
            userName: testAccount.user,
            password: {
              decryptedValue: testAccount.pass,
            },
          },
        },
      },
    };

    const inputParameterValues = { iteratorTotal: '3' };

    const instanceAction = { ...defailtInstanceAction };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '141413123123',
        status: 'READY',
        fetchedIntegrations: {
          [defaultIntegration.id]: defaultIntegration,
        },
      },
      instanceActions: {
        [instanceAction.action.id as string]: instanceAction,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerMailTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.accepted).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.rejected).toHaveLength(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.ehlo).toEqual([
      'PIPELINING',
      '8BITMIME',
      'SMTPUTF8',
      'AUTH LOGIN PLAIN',
    ]);

    // expect(logEvent).toHaveBeenCalledWith({
    //   instanceId: '141413123123',
    //   sourceId: '57567567',
    //   targetId: '123',
    //   logKey: 'MAIL_MESSAGE_DATA',
    //   references: {
    //     from: 'from@me.com',
    //     to: 'you@hey.com',
    //     subject: 'Sample Email',
    //     html: '<!DOCTYPE html>\n<html>\n<body>\n    hello im email \n</body>\n</html>\n',
    //     encoding: 'utf-8',
    //     priority: 'normal',
    //     headers: {},
    //   },
    // });
  });

  it('email can be sent to user from mail.ukraine', async () => {
    const defaultIntegration: IntegrationModel = {
      id: '777',
      workspaceId: '1',
      name: 'name',
      type: 'EMAIL',
      mail: {
        host: 'mail.adm.tools',
        port: 465,
        secure: true,
        defaultAuthentication: {
          type: 'BASIC',
          basicAuth: {
            userName: 'test@caylerandsons.com.ua',
            password: {
              decryptedValue: '76kZP8rJ7h',
            },
          },
        },
      },
    };

    const inputParameterValues = {
      from: 'test@caylerandsons.com.ua',
      to: 'test@caylerandsons.com.ua',
      me: 'Andriiiiii hey',
      replace_me: "i'm in html wow wow wow",
    };

    const instanceAction: InstanceActionModel = {
      ...defailtInstanceAction,
      action: {
        ...defailtInstanceAction.action,
        involvedIntegrationId: '777',
        config: {
          ...defailtInstanceAction.action.config,
          mail: {
            mailOption: {
              ...(defailtInstanceAction.action.config.mail
                ?.mailOption as MailConfigurationOptions),
              from: '{{{from}}}',
              to: '{{to}}',
              subject: 'Sample Email from {{{me}}}',
              html: '<!DOCTYPE html>\n<html>\n<body>\n    hello im email {{{replace_me}}} \n</body>\n</html>\n',
              text: 'i can do it also from text {{{replace_me}}}',
            },
          },
        },
      },
    };

    const instanceEngineMessageDTO: InstanceEngineMessageDTO = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      instance: {
        id: '141413123123',
        status: 'READY',
        fetchedIntegrations: {
          [defaultIntegration.id]: defaultIntegration,
        },
      },
      instanceActions: {
        [instanceAction.action.id as string]: instanceAction,
      },
    };
    await initNewInstanceRunCache(instanceEngineMessageDTO);

    const response = await consumerMailTask(
      messageAction,
      instanceAction,
      inputParameterValues
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.accepted).toHaveLength(1);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(response.outputParameterValues.rejected).toHaveLength(0);

    // expect(logEvent).toHaveBeenCalledWith({
    //   instanceId: '141413123123',
    //   sourceId: '57567567',
    //   targetId: '123',
    //   logKey: 'MAIL_MESSAGE_DATA',
    //   references: {
    //     from: 'test@caylerandsons.com.ua',
    //     to: 'test@caylerandsons.com.ua',
    //     subject: 'Sample Email from Andriiiiii hey',
    //     html: "<!DOCTYPE html>\n<html>\n<body>\n    hello im email i'm in html wow wow wow \n</body>\n</html>\n",
    //     encoding: 'utf-8',
    //     priority: 'normal',
    //     headers: {},
    //     text: "i can do it also from text i'm in html wow wow wow",
    //   },
    // });
  });
});
