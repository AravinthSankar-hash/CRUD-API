import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { CanActivate } from '@nestjs/common/interfaces/features/can-activate.interface';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import * as jwt from 'jsonwebtoken';

import { APP_CONST } from '../constants/app.const';

/**
 * Service to validate headers
 *
 * @export
 * @class HeaderValidator
 * @implements {CanActivate}
 */
@Injectable()
export class HeaderValidator implements CanActivate {
  /**
   * Method to validate application headers
   *
   * @param {ExecutionContext} context
   * @memberof HeaderValidator
   * @returns {boolean}
   */
  public canActivate = (
    context: ExecutionContext,
  ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> => {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;
    if (!headers.authorization) {
      throw new UnauthorizedException(APP_CONST.RESPONSE.INVALID_HEADER);
    }
    try {
      jwt.verify(headers.authorization, APP_CONST.SALT);
      return true;
    } catch (error) {
      throw new UnauthorizedException(APP_CONST.RESPONSE.INVALID_TOKEN);
    }
  };
}
