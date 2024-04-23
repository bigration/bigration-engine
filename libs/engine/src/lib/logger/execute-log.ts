import { InstanceLogModel } from '@bigration/studio-api-interface';
import { logger } from './logger'; // Define a queue to store incoming log messages
// Define a queue to store incoming log messages
const logQueue: InstanceLogModel[] = [];

// Define a timer to periodically process the queue
setInterval(() => {
  // If there are no messages in the queue, return early
  if (logQueue.length === 0) {
    return;
  }

  try {
    // Save the documents in bulk
    // publishLog(logQueue);

    // Clear the queue
    logQueue.length = 0;
  } catch (error) {
    logger.error(error);
  }
}, 2000);

function executeLog(messageLog: InstanceLogModel) {
  // Add the log message to the queue
  logQueue.push(messageLog);
}

export default executeLog;
