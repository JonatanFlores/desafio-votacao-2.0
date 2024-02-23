import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

interface SchemaMap {
  body?: ZodSchema;
  param?: ZodSchema;
  query?: ZodSchema;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schemas: SchemaMap) {}

  transform(value: any, metadata: any) {
    const { type } = metadata;
    const schema = this.schemas[type];
    if (!schema) {
      return value;
    }
    try {
      return schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: this.transformErrors(fromZodError(error)),
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }

  private transformErrors(zodErrorObject: any) {
    const simplifiedErrors: Record<string, string> = {};
    zodErrorObject.details.forEach((detail: any) => {
      const path = detail.path.join('.');
      simplifiedErrors[path] = detail.message;
    });
    return simplifiedErrors;
  }
}
