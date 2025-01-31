import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/config/types";
import { IUserCommandService } from "./IUserCommandService";
import { IUserRepository } from "../../../persistance/IUserRepository";
import { UserResult } from "../../../common/UserResult";
import User from "../../../../domain/User/User";
import { Result, ok, err } from "neverthrow";
import {
  AppError,
  ConflictError,
  UserNotFoundError,
  ValidationError,
} from "../../../common/errors/errors";

@injectable()
export default class UserCommandService implements IUserCommandService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  public async CreateUser(
    email: string,
    address: string,
    firstName: string,
    lastName: string
  ): Promise<Result<UserResult, AppError>> {
    try {
      const user = await this._userRepository.Get(email);
      if (user != null) return err(new ConflictError("User already exists"));

      const newUser = new User(email, address, firstName, lastName);
      await this._userRepository.Add(newUser);

      return ok(
        new UserResult(newUser.id, email, address, firstName, lastName)
      );
    } catch (error) {
      return err(new UserNotFoundError());
    }
  }

  public async UpdateUser(
    email: string,
    address: string,
    firstName: string,
    lastName: string
  ): Promise<Result<UserResult, AppError>> {
    try {
      if (!email) {
        return err(new ValidationError("Email is required"));
      }
      const user = await this._userRepository.Get(email);
      if(user == null) return err(new UserNotFoundError());

      const newUser = new User(email, address, firstName, lastName, user.id);

      await this._userRepository.Update(newUser);

      return ok(
        new UserResult(newUser.id, email, address, firstName, lastName)
      );
    } catch (error) {
      return err(new UserNotFoundError());
    }
  }

  public async DeleteUser(
    email: string
  ): Promise<Result<UserResult, AppError>> {
    try {
      const user = await this._userRepository.Get(email);
      if (user == null) return err(new UserNotFoundError());
      await this._userRepository.Delete(email);

      return ok(
        new UserResult(
          user.id,
          email,
          user.address,
          user.firstName,
          user.lastName
        )
      );
    } catch (error) {
      return err(new UserNotFoundError());
    }
  }
}
