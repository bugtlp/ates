import { Provider } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const MESSAGE_BROKER_CLIENT = Symbol('MessageBrokerClient');

function messageBrokerClientFactory(config: ConfigService): ClientKafka {
  return new ClientKafka({
    client: {
      clientId: 'task-tracker',
      brokers: [config.get('KAFKA_BROKER') || 'localhost:9092'],
    },
    consumer: {
      groupId: 'task-tracker-consumer',
    },
  });
}

export const messageBrokerClientProvider: Provider = {
  inject: [ConfigService],
  provide: MESSAGE_BROKER_CLIENT,
  useFactory: messageBrokerClientFactory,
};
