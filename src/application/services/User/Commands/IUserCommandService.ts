import { UserResult } from "../../../common/UserResult";
import { Result } from "neverthrow";
import { AppError } from "../../../common/errors/errors";
export interface IUserCommandService {
  CreateUser(
    email: string,
    address: string,
    firstName: string,
    lastName: string
  ): Promise<Result<UserResult, AppError>>;
  UpdateUser(
    email: string,
    address: string,
    firstName: string,
    lastName: string
  ): Promise<Result<UserResult, AppError>>;

  DeleteUser(email: string): Promise<Result<UserResult, AppError>>;
}
