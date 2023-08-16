/* eslint-disable @typescript-eslint/no-explicit-any */
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Knex, knex } from 'knex';

export const DB_CONNECTION = Symbol('DbConnection');

export function dbConnectionFactory(configService: ConfigService): Knex {
  const connectionConfig: Knex.PgConnectionConfig = {
    database: String(configService.get('DB_NAME')),
    host: String(configService.get(`DB_HOST`)),
    password: String(configService.get(`DB_PASSWORD`)),
    port: Number(configService.get(`DB_PORT`)) || 5432,
    user: String(configService.get(`DB_USER`)),
  };

  const config: Knex.Config = {
    client: 'pg',
    connection: connectionConfig,
    pool: {
      afterCreate: (
        conn: any,
        done: (err?: Error, conn?: any) => void,
      ): void => {
        conn.query('SET timezone="UTC";', (err: Error) => done(err, conn));
      },
    },
  };

  return knex(config);
}

export const dbConnectionProvider: Provider = {
  inject: [ConfigService],
  provide: DB_CONNECTION,
  useFactory: dbConnectionFactory,
};
