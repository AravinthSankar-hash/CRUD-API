import { applyDecorators, UseGuards } from '@nestjs/common';
import { HeaderValidator } from '../services/header-validator.helper';

/**
 * Method to validate service headers
 *
 * @export
 * @returns {Function}
 */
// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/naming-convention
export function HeaderGuard(): Function {
  return applyDecorators(UseGuards(HeaderValidator));
}
