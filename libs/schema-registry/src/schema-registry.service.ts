import { Injectable } from '@nestjs/common';
import Ajv, { AnySchema, ValidateFunction } from 'ajv';

@Injectable()
export class SchemaRegistryService {
  private readonly validators = new Map<string, ValidateFunction>();

  private readonly ajv = new Ajv();

  public addSchema(schema: AnySchema, eventName: string): void {
    const validator = this.ajv.compile(schema);
    this.validators.set(eventName, validator);
  }

  public validate(data: any, eventName: string): boolean {
    const validator = this.validators.get(eventName);

    if (validator) {
      return validator(data);
    }

    throw new Error(`Not found schema for ${eventName}`);
  }

  public encode(data: any, eventName: string): string {
    if (this.validate(data, eventName)) {
      return JSON.stringify(data);
    }

    throw new Error('Encode error');
  }
}
