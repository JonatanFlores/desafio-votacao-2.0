import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';

export function transformErrors(error: ZodError) {
  const zodErrorObject = fromZodError(error);
  const simplifiedErrors: Record<string, string> = {};
  zodErrorObject.details.forEach((detail: any) => {
    const path = detail.path.join('.');
    simplifiedErrors[path] = detail.message;
  });
  return simplifiedErrors;
}
