import { Result } from "neverthrow";
import { AppError } from "../../../common/errors/errors";
import { UserResult } from "../../../common/UserResult";

export interface IUserQueryService {
    GetUser(email: string): Promise<Result<UserResult | null, AppError>>;
    GetAllUser(): Promise<Result<UserResult[] | null, AppError>>
}