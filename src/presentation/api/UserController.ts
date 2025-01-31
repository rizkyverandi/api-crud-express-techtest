import { Request, Response } from "express";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import {
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from "inversify-express-utils";
import { CreateUserRequest } from "../contracts/User/CreateUserRequest";
import { UserResponse } from "../contracts/User/UserReponse";
import { GetUserRequest } from "../contracts/User/GetUserRequest";
import UserCommandService from "../../application/services/User/Commands/UserCommandService";
import UserQueryService from "../../application/services/User/Queries/UserQueryService";
import { UpdateUserRequest } from "../contracts/User/UpdateUserRequest";
import { DeleteUserRequest } from "../contracts/User/DeleteUserRequest";
import {
  handleUserResponse,
  handleUserListResponse,
} from "../utils/responseHandler";
@controller("/user")
export default class UserController {
  constructor(
    @inject(TYPES.UserCommandService)
    private readonly _userCommandService: UserCommandService,
    @inject(TYPES.UserQueryService)
    private readonly _userQueryService: UserQueryService
  ) {}

  @httpPost("/")
  public async CreateUser(
    request: Request<CreateUserRequest>,
    response: Response<UserResponse | { error: string }>,
  ) {
    const result = await this._userCommandService.CreateUser(
      request.body.email,
      request.body.address,
      request.body.firstName,
      request.body.lastName
    );

    return handleUserResponse(response, result, 201);
  }

  @httpGet("/get-user")
  public async GetUser(
    request: Request<GetUserRequest>,
    response: Response<UserResponse | { error: string }>
  ) {
    const result = await this._userQueryService.GetUser(request.body.email);

    return handleUserResponse(response, result);
  }

  @httpGet("/get-all-user")
  public async GetAllUser(
    request: Request,
    response: Response<UserResponse[] | null | { error: string }>
  ) {
    const result = await this._userQueryService.GetAllUser();

    return handleUserListResponse(response, result);
  }

  @httpPut("/update-user")
  public async UpdateUser(
    request: Request<UpdateUserRequest>,
    response: Response<UserResponse | { error: string }>
  ) {
    const result = await this._userCommandService.UpdateUser(
      request.body.email,
      request.body.address,
      request.body.firstName,
      request.body.lastName
    );

    return handleUserResponse(response, result);
  }

  @httpDelete("/delete-user")
  public async DeleteUser(
    request: Request<DeleteUserRequest>,
    response: Response<UserResponse | { error: string }>
  ) {
    const result = await this._userCommandService.DeleteUser(
      request.body.email
    );
    return handleUserResponse(response, result);
  }
}
