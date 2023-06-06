import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from 'tsoa';
import { injectable } from 'tsyringe';

import { IUser } from './user';
import { UsersService } from './usersService';

@injectable()
@Route('v1/users')
// eslint-disable-next-line import/prefer-default-export
export class UsersController extends Controller {
  constructor(private usersService: UsersService) {
    super();
  }

  @Get('/get/{userId}')
  public async getUser(@Path() userId: string): Promise<IUser> {
    this.setStatus(200); // set return status 200
    return this.usersService.get(userId);
  }

  @Get('/all')
  public async getAllUser(): Promise<IUser[]> {
    this.setStatus(200);
    return this.usersService.getAll();
  }

  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createUser(
    @Body()
    requestBody: {
      firstname: string;
      lastname: string;
      email: string;
      admin: boolean;
    },
  ): Promise<IUser> {
    this.setStatus(201); // set return status 201
    return this.usersService.create(requestBody);
  }
}
