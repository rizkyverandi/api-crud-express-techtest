import { Response } from "express";
import { UserResponse } from "../contracts/User/UserReponse";
import {
  UserNotFoundError,
  ValidationError,
  ConflictError,
} from "../../application/common/errors/errors";

export function handleResponse<T>(
  response: Response,
  result: {
    match: (
      onSuccess: (data: T) => void,
      onError: (error: any) => void
    ) => void;
  },
  statusCode: number = 200,
  successCallback: (data: T) => any
) {
  return result.match(
    (data: T) => {
      const res = successCallback(data);
      return response.status(statusCode).json(res);
    },
    (error: any) => {
      switch (error.constructor) {
        case UserNotFoundError:
          return response.status(404).json({ error: error.message });
        case ValidationError:
          return response.status(400).json({ error: error.message });
        case ConflictError:
          return response.status(409).json({ error: error.message });
        default:
          if (error instanceof Error) {
            return response.status(500).json({ error: error.message });
          }
          return response.status(500).json({ error: "Internal server error" });
      }
    }
  );
}

export function handleUserResponse(
  response: Response,
  result: {
    match: (
      onSuccess: (data: any) => void,
      onError: (error: any) => void
    ) => void;
  },
  statusCode: number = 200
) {
  return (
    handleResponse<UserResponse>(response, result, statusCode, (user) => {
      return new UserResponse(
        user.id,
        user.email,
        user.address,
        user.firstName,
        user.lastName
      );
    })
  );
}

export function handleUserListResponse(
  response: Response,
  result: {
    match: (
      onSuccess: (data: any) => void,
      onError: (error: any) => void
    ) => void;
  },
  statusCode: number = 200
) {
  return (
    handleResponse<UserResponse[]>(response, result, statusCode, (users) => {
      return users.map(
        (user) =>
          new UserResponse(
            user.id,
            user.email,
            user.address,
            user.firstName,
            user.lastName
          )
      );
    })
  );
}
