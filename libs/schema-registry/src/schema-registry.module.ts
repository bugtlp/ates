import { Module, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join, parse } from 'path';
import { SchemaRegistryService } from './schema-registry.service';

@Module({
  providers: [SchemaRegistryService],
  exports: [SchemaRegistryService],
})
export class SchemaRegistryModule implements OnModuleInit {
  constructor(private readonly schemaRegistry: SchemaRegistryService) {}

  public async onModuleInit() {
    const schemaPath = join(
      __dirname,
      '../../../libs/schema-registry/src/schemas',
    );
    const paths: string[] = await this.getFilelist(schemaPath);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const eventName = parse(path.split('/').slice(-3).join('.')).name;
      const schemaBuffer = await readFile(path);
      const schema = JSON.parse(schemaBuffer.toString());
      this.schemaRegistry.addSchema(schema, eventName);
    }
  }

  private async getFilelist(dir: string): Promise<string[]> {
    // Тут должен быть код для рекурсивного чтения каталога
    return [
      join(dir, 'task/created/v1.json'),
      join(dir, 'task/added/v1.json'),
      join(dir, 'task/completed/v1.json'),
    ];
  }
}
