// import { handleOAuth20 } from '../consumers/consumers/rest-task/authenticate-rest-task';
// import { logger } from '../logger';
// import * as jose from 'jose';
//
// export const getWFServiceClientToken = async (
//   verify?: boolean
// ): Promise<string> => {
//   const clientId = `workflow-engine_${process.env['ENGINE_ID']}`;
//   const clientSecret = process.env['WF_CLIENT_SECRET'] || '';
//
//   const accessTokenUrl =
//     process.env['NX_WF_SERVICE_ACC_AUTH_TOKEN_URL'] ||
//     'https://auth.bigration.com/realms/bigration/protocol/openid-connect/token';
//
//   if (verify) {
//     logger.info(`clientId: ${clientId}`);
//     logger.info(`clientSecret: ${clientSecret}`);
//     logger.info(`accessTokenUrl: ${accessTokenUrl}`);
//   }
//   const bearerToken = await handleOAuth20({
//     restConfig: {},
//     inputParameterValues: {},
//     oAuth2: {
//       clientAuth: 'BODY',
//       type: 'CLIENT_CREDENTIALS',
//       accessTokenUrl,
//       clientId,
//       clientSecret,
//     },
//   });
//
//   if (verify) {
//     const parsedToken = jose.decodeJwt(bearerToken);
//     logger.info('Parsed Token');
//     logger.info(parsedToken);
//
//     const parsedTokenElement = parsedToken['realm_access'] as Record<
//       string,
//       string[] | string
//     >;
//     const parsedTokenElementElement = parsedTokenElement['roles'];
//     if (!parsedTokenElementElement.includes('workflow-engine')) {
//       throw Error('Token does not have workflow engine service role');
//     }
//   }
//
//   return bearerToken;
// };
