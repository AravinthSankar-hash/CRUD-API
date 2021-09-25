/**
 * Updateuser DTO
 *
 * @export
 * @class UpdateUserDto
 */
export class UpdateUserDto {
  acknowledged: boolean;
  matchedCount?: number;
  modifiedCount?: number;
  statusCode?: number;
  upsertedCount?: number;
  upsertedId?: any;
}
