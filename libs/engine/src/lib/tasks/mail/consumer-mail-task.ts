import * as nodemailer from 'nodemailer';
import { SendMailOptions, Transporter } from 'nodemailer';
import { keyValueParser } from '../../utils/parsers';
import { INSTANCE_LOG_KEYS } from '../../constants';
import {
  InstanceActionModel,
  IntegrationModel,
} from '@bigration/studio-api-interface';
import { HandleActionResponseType, MessageActionFlowType } from '../../types';
import { fetchIntegration } from '../../common';
import { templateRenderObject } from '../../utils';
import { logEvent } from '../../logger';
import { Headers } from 'nodemailer/lib/mailer';

async function getEmailTransporter(
  integration: IntegrationModel
): Promise<Transporter> {
  if (integration.mail) {
    return nodemailer.createTransport({
      host: integration.mail.host,
      port: integration.mail.port,
      secure: integration.mail.secure,
      auth: {
        user: integration.mail?.defaultAuthentication?.basicAuth?.userName,
        pass: integration.mail?.defaultAuthentication?.basicAuth?.password
          ?.decryptedValue,
      },
    });
  } else {
    throw new Error('Integration not found');
  }
}

export const consumerMailTask = async (
  messageAction: MessageActionFlowType,
  instanceAction: InstanceActionModel,
  inputParameterValues: Record<string, unknown>
): Promise<HandleActionResponseType> => {
  const { instanceId, targetId, sourceId } = messageAction;
  const { action } = instanceAction;
  const { config } = action;
  const { mail } = config;

  const integration = await fetchIntegration(
    messageAction,
    action?.involvedIntegrationId
  );

  const transporter = await getEmailTransporter(integration);

  if (!mail?.mailOption) {
    throw new Error('Mail option not found');
  }
  const { mailOption } = mail;

  const mailOptions: SendMailOptions = {
    from: templateRenderObject(inputParameterValues, mailOption.from),
    to: templateRenderObject(inputParameterValues, mailOption.to),
    subject: templateRenderObject(inputParameterValues, mailOption.subject),
    text: templateRenderObject(inputParameterValues, mailOption.text),
    html: templateRenderObject(inputParameterValues, mailOption.html),
    encoding: mailOption.encoding,
    priority: mailOption.priority,
    headers: keyValueParser(
      mailOption.headers || [],
      inputParameterValues
    ) as Headers,
  };

  logEvent({
    instanceId,
    sourceId,
    targetId,
    logKey: INSTANCE_LOG_KEYS.MAIL_MESSAGE_DATA,
    references: {
      ...mailOptions,
    },
  });

  const info = await transporter.sendMail(mailOptions);

  return {
    outputParameterValues: {
      ...info,
    },
  };
};
