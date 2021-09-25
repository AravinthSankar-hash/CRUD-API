/**
 * CreateUser DTO
 *
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto {
  name: string;
  email: string;
  location?: string;
  contact?: number | string;
  password: string;
}
