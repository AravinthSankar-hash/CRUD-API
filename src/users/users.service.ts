import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from '../dtos/create-user-dto';
import { User, UserDocument } from '../schemas/users.schema';
import { APP_CONST } from '../shared/constants/app.const';
import { UpdateUserDto } from '../dtos/update-user-dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Method to save user details
   *
   * @param {CreateUserDto} createUserDto
   * @memberof UserService
   */
  public create = async (
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; data: User | null }> => {
    const response = {
      message: '',
      data: null,
    };
    try {
      const existingUser = await this.findUserByEmail(createUserDto.email);
      if (existingUser || Object(existingUser).keys) {
        response.message = APP_CONST.RESPONSE.INVALID_EMAIL;
        return response;
      }
      createUserDto.password = this.encryptPassword(createUserDto.password);
      let createdUser = new this.userModel(createUserDto);
      createdUser = await createdUser.save();
      (response.message = APP_CONST.RESPONSE.USER_CREATED),
        (response.data = createdUser);
      return response;
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to encrpty password
   *
   * @param {string} password
   * @memberof UserService
   */
  public encryptPassword = (password: string): string => {
    const hash = bcrypt.hashSync(password, APP_CONST.HASH_ROUNDS);
    return hash;
  };

  /**
   * Method to fetch userdetails by email
   *
   * @param {string} email
   * @memberof UserService
   */
  public findUserByEmail = (email: string) => {
    try {
      return this.userModel.findOne({
        email,
      });
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to validate user login details
   *
   * @param {{
   *     email: string;
   *     password: string;
   *   }} loginUserDto
   * @memberof UserService
   */
  public validateUser = async (loginUserDto: {
    email: string;
    password: string;
  }) => {
    const response = {
      statusCode: APP_CONST.STATUS_CODE.SUCCESS,
      message: '',
      token: null,
    };
    try {
      const userDetails = await this.findUserByEmail(loginUserDto.email);
      if (!userDetails) {
        (response.statusCode = APP_CONST.STATUS_CODE.NOT_FOUND),
          (response.message = APP_CONST.RESPONSE.USER_NOT_FOUND);
        return response;
      }
      const isPasswordMatched = this.validatePassword(
        userDetails.password,
        loginUserDto.password,
      );
      if (!isPasswordMatched) {
        response.statusCode = APP_CONST.STATUS_CODE.INTERNAL;
        response.message = APP_CONST.RESPONSE.INVALID_PASSWORD;
        return response;
      }
      const token = this.generateToken(userDetails);
      response.message = APP_CONST.RESPONSE.LOGIN_SUCCESS;
      response.token = token;
      return response;
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to compare password
   *
   * @param {string} dbPassword
   * @param {string} userPassword
   * @memberof UserService
   */
  public validatePassword = (
    dbPassword: string,
    userPassword: string,
  ): boolean => {
    try {
      return bcrypt.compareSync(userPassword, dbPassword);
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to generate token
   *
   * @param {*} userDetails
   * @memberof UserService
   */
  public generateToken = (userDetails): string => {
    try {
      const tokenDetails = {
        name: userDetails.name,
        email: userDetails.email,
      };
      return jwt.sign(tokenDetails, APP_CONST.SALT);
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to fetch all user details except system admin and password filed
   *
   * @memberof UserService
   */
  public getAllUsers = () => {
    try {
      return this.userModel.find(
        { name: { $ne: APP_CONST.SYS_ADMIN } },
        { password: 0 },
      );
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to update userdetails
   *
   * @param {{
   *       name?: string;
   *       location?: string;
   *       contact?: number;
   *     }} updateUserDto
   * @param {string} email
   * @memberof UserService
   */
  public updateUser = async (
    updateUserDto: {
      name?: string;
      location?: string;
      contact?: number;
    },
    email: string,
  ): Promise<UpdateUserDto> => {
    try {
      const updatedUserResponse = await this.userModel.updateOne(
        {
          email,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        },
      );
      updatedUserResponse['statusCode'] = APP_CONST.STATUS_CODE.SUCCESS;
      return updatedUserResponse;
    } catch (error) {
      return error;
    }
  };

  /**
   * Method to delete mentioned user
   *
   * @param {string} email
   * @memberof UserService
   */
  public removeUser = async (email: string) => {
    try {
      const deleteResponse = await this.userModel.deleteOne({ email });
      deleteResponse['statusCode'] = APP_CONST.STATUS_CODE.SUCCESS;
      return deleteResponse;
    } catch (error) {
      return error;
    }
  };
}
