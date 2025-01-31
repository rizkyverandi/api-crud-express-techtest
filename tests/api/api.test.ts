import { Request, Response } from "express";
import UserController from "../../src/presentation/api/UserController";
import UserCommandService from "../../src/application/services/User/Commands/UserCommandService";
import UserQueryService from "../../src/application/services/User/Queries/UserQueryService";
import {
  AppError,
  ConflictError,
  UserNotFoundError,
  ValidationError,
} from "../../src/application/common/errors/errors";
import { ok, err, Result } from "neverthrow";
import { CreateUserRequest } from "../../src/presentation/contracts/User/CreateUserRequest";
import { UserResult } from "../../src/application/common/UserResult";
import { GetUserRequest } from "../../src/presentation/contracts/User/GetUserRequest";
import { UpdateUserRequest } from "../../src/presentation/contracts/User/UpdateUserRequest";
import { DeleteUserRequest } from "../../src/presentation/contracts/User/DeleteUserRequest";

describe("UserController", () => {
  let userController: UserController;
  let mockUserCommandService: jest.Mocked<UserCommandService>;
  let mockUserQueryService: jest.Mocked<UserQueryService>;
  const mockUserResponse = {
    email: "test@example.com",
    address: "123 Street",
    firstName: "John",
    lastName: "Doe",
  };

  beforeEach(() => {
    mockUserCommandService = {
      CreateUser: jest.fn(),
      UpdateUser: jest.fn(),
      DeleteUser: jest.fn(),
    } as unknown as jest.Mocked<UserCommandService>;

    mockUserQueryService = {
      GetUser: jest.fn(),
      GetAllUser: jest.fn(),
    } as unknown as jest.Mocked<UserQueryService>;

    userController = new UserController(
      mockUserCommandService,
      mockUserQueryService
    );
  });

  describe("CreateUser", () => {
    it("should return 201 when user is created successfully", async () => {
      mockUserCommandService.CreateUser.mockResolvedValue(
        ok(mockUserResponse) as Result<UserResult, AppError>
      );
      const req = { body: mockUserResponse } as Request<CreateUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.CreateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockUserResponse);
    });

    it("should return 400 for validation error", async () => {
      const error = new ValidationError("Invalid email");
      mockUserCommandService.CreateUser.mockResolvedValue(err(error));
      const req = { body: mockUserResponse } as Request<CreateUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.CreateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid email" });
    });

    it("should return 409 for conflict error", async () => {
      const error = new ConflictError("User already exists");
      mockUserCommandService.CreateUser.mockResolvedValue(err(error));
      const req = { body: mockUserResponse } as Request<CreateUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.CreateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ error: "User already exists" });
    });
  });

  describe("GetUser", () => {
    it("should return 200 with user data", async () => {
      mockUserQueryService.GetUser.mockResolvedValue(
        ok(mockUserResponse) as Result<UserResult, AppError>
      );
      const req = {
        body: { email: "test@example.com" },
      } as Request<GetUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.GetUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserResponse);
    });

    it("should return 404 when user not found", async () => {
      const error = new UserNotFoundError();
      mockUserQueryService.GetUser.mockResolvedValue(err(error));
      const req = {
        body: { email: "test@example.com" },
      } as Request<GetUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.GetUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });

  describe("GetAllUser", () => {
    it("should return 200 with user list", async () => {
      const users = [mockUserResponse];
      mockUserQueryService.GetAllUser.mockResolvedValue(
        ok(users) as Result<UserResult[], AppError>
      );
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.GetAllUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it("should return 500 for generic error", async () => {
      mockUserQueryService.GetAllUser.mockResolvedValue(
        err(new Error("Database error"))
      );
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.GetAllUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("UpdateUser", () => {
    it("should return 200 with updated user", async () => {
      mockUserQueryService.GetUser.mockResolvedValue(
        ok(mockUserResponse) as Result<UserResult, AppError>
      );
      mockUserCommandService.UpdateUser.mockResolvedValue(
        ok(mockUserResponse) as Result<UserResult, AppError>
      );
      const req = { body: mockUserResponse } as Request<UpdateUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.UpdateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserResponse);
    });

    //TODO: error di unit test tapi tidak error pada saat manual testing
    it("should return 404 if user not found", async () => {
      const error = new UserNotFoundError();
      mockUserQueryService.GetUser.mockResolvedValue(
        err(error) as Result<UserResult, AppError>
      );
      const req = { body: mockUserResponse } as Request<UpdateUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.UpdateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith();
    });
  });

  describe("DeleteUser", () => {
    it("should return 200 when user is deleted", async () => {
      mockUserCommandService.DeleteUser.mockResolvedValue(
        ok(mockUserResponse) as Result<UserResult, AppError>
      );
      const req = {
        body: { email: "test@example.com" },
      } as Request<DeleteUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.DeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUserResponse);
    });

    it("should return 404 when user not found", async () => {
      const error = new UserNotFoundError();
      mockUserCommandService.DeleteUser.mockResolvedValue(err(error));
      const req = {
        body: { email: "test@example.com" },
      } as Request<DeleteUserRequest>;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await userController.DeleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });
  });
});
