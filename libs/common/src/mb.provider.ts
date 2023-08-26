import { Provider } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { SchemaRegistryService } from '../../schema-registry/src';

export const MESSAGE_BROKER_CLIENT = Symbol('MessageBrokerClient');

export class MessageBrokerClient {
  constructor(
    private readonly client: ClientKafka,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async emit(
    topic: string,
    eventName: string,
    data: any,
  ): Promise<void> {
    const message = this.schemaRegistry.encode(data, eventName);
    const observable = this.client.emit(topic, message);
    await lastValueFrom(observable);
  }
}

function messageBrokerClientFactory(
  config: ConfigService,
  schemaRegistry: SchemaRegistryService,
): MessageBrokerClient {
  const client = new ClientKafka({
    client: {
      clientId: config.get('KAFKA_CLIENT_ID'),
      brokers: [config.get('KAFKA_BROKER') || 'localhost:9092'],
    },
    consumer: {
      groupId: config.get('KAFKA_CONSUMER_GROUP_ID') || 'consumer',
    },
  });

  return new MessageBrokerClient(client, schemaRegistry);
}

export const messageBrokerClientProvider: Provider = {
  inject: [ConfigService, SchemaRegistryService],
  provide: MESSAGE_BROKER_CLIENT,
  useFactory: messageBrokerClientFactory,
};
