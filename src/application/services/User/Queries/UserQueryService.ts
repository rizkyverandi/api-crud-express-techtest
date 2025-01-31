import { inject, injectable } from "inversify";
import { TYPES } from "../../../../presentation/config/types";
import { IUserQueryService } from "./IUserQueryService";
import { IUserRepository } from "../../../persistance/IUserRepository";
import { UserResult } from "../../../common/UserResult";
import { err, ok, Result } from "neverthrow";
import { AppError, UserNotFoundError } from "../../../common/errors/errors";
@injectable()
export default class UserQueryService implements IUserQueryService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  public async GetUser(
    email: string
  ): Promise<Result<UserResult | null, AppError>> {
    try {
      const result = await this._userRepository.Get(email);
      if (!result) return err(new UserNotFoundError());

      return ok(
        new UserResult(
          result.id,
          email,
          result.address,
          result.firstName,
          result.lastName
        )
      );
    } catch (error) {
      return err(new UserNotFoundError());
    }
  }

  public async GetAllUser(): Promise<Result<UserResult[] | null, AppError>> {
    try {
      const result = await this._userRepository.GetAll();

      if (!result) return err(new UserNotFoundError());

      return ok(
        result.map(
          (user) =>
            new UserResult(
              user.id,
              user.email,
              user.address,
              user.firstName,
              user.lastName
            )
        )
      );
    } catch (error) {
      return err(new UserNotFoundError());
    }
  }
}
