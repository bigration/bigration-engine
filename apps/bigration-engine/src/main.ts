import Fastify from 'fastify';
import { app } from './app/app';
import {
  initAmqpClient,
  initCache,
  logger,
  requestSchedulers,
} from '@bigration/engine';
import * as process from 'process';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port, host }, async (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${host}:${port}`);

    // Start the workflow engine
    const run = async () => {
      logger.info(
        `Starting workflow engine with id: ${process.env['ENGINE_ID']} `
      );

      if (!process.env['ENGINE_ID']) {
        logger.error(`can not find engine id, provide env variable: ENGINE_ID`);
        process.exit();
      }

      try {
        await initCache();
        await initAmqpClient();
        requestSchedulers(process.env['ENGINE_ID']);
      } catch (error) {
        logger.error('Init Error process ends');
        logger.error(error);
        process.exit();
      }
    };

    run().catch((er) => {
      logger.error('can not start');
      logger.error(er);
      process.exit();
    });
  }
});
