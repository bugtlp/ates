import { Provider } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const MESSAGE_BROKER_CLIENT = Symbol('MessageBrokerClient');

function messageBrokerClientFactory(config: ConfigService): ClientKafka {
  return new ClientKafka({
    client: {
      clientId: config.get('KAFKA_CLIENT_ID'),
      brokers: [config.get('KAFKA_BROKER') || 'localhost:9092'],
    },
    consumer: {
      groupId: config.get('KAFKA_CONSUMER_GROUP_ID') || 'consumer',
    },
  });
}

export const messageBrokerClientProvider: Provider = {
  inject: [ConfigService],
  provide: MESSAGE_BROKER_CLIENT,
  useFactory: messageBrokerClientFactory,
};
