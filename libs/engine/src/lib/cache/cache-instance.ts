import { caching } from 'cache-manager';
import { MemoryCache } from 'cache-manager/dist/stores';
import { logger } from '../logger';

let memoryCache: MemoryCache | null = null;

export const getEngineCache = (): MemoryCache => {
  if (!memoryCache) {
    throw new Error('Cache instance not initialized');
  }
  return memoryCache;
};

// setInterval(() => {
//   logger.debug('Current cache');
//   logger.debug(memoryCache?.store?.dump());
// }, 2000);

export const initCache = async () => {
  memoryCache = await caching('memory');
  logger.debug('MemoryCache initialized');
};
