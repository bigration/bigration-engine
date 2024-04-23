import {
  InstanceActionUpdateWebsocketDTO,
  InstanceLogModel,
  InstanceUpdateWebsocketDTO,
  StatisticsUpdateEngineDTO,
} from '@bigration/studio-api-interface';
import { getEngineId, getProducerChannel } from '../utils/amqp-client';

export function publishLog(log: InstanceLogModel) {
  getProducerChannel().publish(
    getEngineId(),
    'update.log',
    Buffer.from(JSON.stringify(log))
  );
}

export function saveInstanceActionUpdate(
  queue: InstanceActionUpdateWebsocketDTO
) {
  getProducerChannel().publish(
    getEngineId(),
    'update.instance-action',
    Buffer.from(JSON.stringify(queue))
  );
}

export function saveInstanceUpdate(queue: InstanceUpdateWebsocketDTO) {
  getProducerChannel().publish(
    getEngineId(),
    'update.instance',
    Buffer.from(JSON.stringify(queue))
  );
}

export function saveStatisticsUpdate(queue: StatisticsUpdateEngineDTO) {
  getProducerChannel().publish(
    getEngineId(),
    'update.statistics',
    Buffer.from(JSON.stringify(queue))
  );
}
