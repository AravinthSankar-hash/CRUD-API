import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreateUserDto } from 'src/dtos/create-user-dto';
import { User } from 'src/schemas/users.schema';
import { UserService } from './users.service';
import { HeaderGuard } from '../shared/decorators/header-guard.decorator';
import { UpdateUserDto } from '../dtos/update-user-dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Hanlder to create user
   *
   * @param {CreateUserDto} createUserDto
   * @return {*}  {(Promise<{ message: string; data: User | null }>)}
   * @memberof UserController
   */
  @Post('/create')
  createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: User | null }> {
    return this.userService.create(createUserDto);
  }

  /**
   * Hanlder to validate user login
   *
   * @param {{ email: string; password: string }} loginUserDto
   * @return {*}  {Promise<{
   *     statusCode: number;
   *     message: string;
   *     token: any;
   *   }>}
   * @memberof UserController
   */
  @Post('/login')
  loginUser(
    @Body() loginUserDto: { email: string; password: string },
  ): Promise<{
    statusCode: number;
    message: string;
    token: any;
  }> {
    return this.userService.validateUser(loginUserDto);
  }

  /**
   * Handler to fetch user list
   *
   * @return {*}
   * @memberof UserController
   */
  @Get('/list')
  @HeaderGuard()
  fetchAllUsers() {
    return this.userService.getAllUsers();
  }

  /**
   * Handler method to update user data
   *
   * @param {string} email
   * @param {{
   *       name?: string;
   *       location?: string;
   *       contact?: number;
   *     }} updateUserDto
   * @return {*}  {Promise<any>}
   * @memberof UserController
   */
  @Put('/update/:email')
  @HeaderGuard()
  updateUserData(
    @Param('email') email: string,
    @Body()
    updateUserDto: {
      name?: string;
      location?: string;
      contact?: number;
    },
  ): Promise<UpdateUserDto> {
    return this.userService.updateUser(updateUserDto, email);
  }

  /**
   * Handler method to delete user data
   *
   * @param {string} email
   * @return {*}  {Promise<any>}
   * @memberof UserController
   */
  @Delete('/remove/:email')
  @HeaderGuard()
  deleteUser(@Param('email') email: string): Promise<any> {
    return this.userService.removeUser(email);
  }
}
