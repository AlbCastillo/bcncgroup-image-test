/* eslint-disable class-methods-use-this */
import { singleton } from 'tsyringe';

import userModel, { IUser } from './user';
import logger from '../../../logging/winstonLogger';
import { ApiError } from '../../../middlewares/apiErrors';

@singleton()
export class UsersService {
  /**
   *  GET USER BY ID
   * @param userId => uuid v4
   * @returns UserModel
   */
  async get(userId: string): Promise<IUser> {
    try {
      logger.info(`getting User with id: ${userId}`);
      const user = await userModel.findOne({ _id: userId });
      if (user) {
        return user;
      }
      throw new Error('User not found!');
    } catch (error: any) {
      logger.error(`Error getting User: ${error.message}`);
      if (error.message === 'User not found!') {
        throw new ApiError({
          statusCode: 404,
          name: 'NotFound',
          message: error.message,
        });
      }
      throw new ApiError({
        statusCode: 500,
        name: 'InternalServerError',
        message: `Opps and error ocurred!`,
      });
    }
  }

  async getAll(): Promise<IUser[]> {
    try {
      const users = await userModel.find();
      return users;
    } catch (error: any) {
      throw new ApiError({
        statusCode: 500,
        name: 'InternalServerError',
        message: `Opps an error ocurred!`,
      });
    }
  }

  /**
   * CREATE AN USER
   * @param user => User create params
   * @returns userId
   */
  async create(user: {
    firstname: string;
    lastname: string;
    email: string;
    admin: boolean;
  }): Promise<IUser> {
    try {
      logger.info(`Creating a new User`);
      return userModel.create(user);
    } catch (error: any) {
      logger.error(`Error creating User ${error.message}`);
      throw new ApiError({
        statusCode: 500,
        name: 'InternalServerError',
        message: `Opps an error ocurred`,
      });
    }
  }
}
