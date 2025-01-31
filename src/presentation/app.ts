import "../presentation/api/UserController";
import express from "express";
import { setupSwagger } from "./config/swagger";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import UserCommandService from "../application/services/User/Commands/UserCommandService";
import UserQueryService from "../application/services/User/Queries/UserQueryService";
import { TYPES } from "./config/types";
import UserRepository from "../infrastructure/persistance/UserRepository";
import { IUserRepository } from "../application/persistance/IUserRepository";

export default class App {
  private static server: InversifyExpressServer;
  public static app: express.Application;

  public static async initialize() {
    const container = new Container();
    //Dependency Injection
    container
      .bind<UserCommandService>(TYPES.UserCommandService)
      .to(UserCommandService);

    container
      .bind<UserQueryService>(TYPES.UserQueryService)
      .to(UserQueryService);

    container
      .bind<IUserRepository>(TYPES.UserRepository)
      .to(UserRepository)
      .inSingletonScope();

    this.server = new InversifyExpressServer(container);

    this.server.setConfig((app) => {
      app.use(express.json());
      // setupSwagger(app);
    });

    this.app = this.server.build();
    return this.app;
  }

  public static async run(port: number) {
    if (!this.app) {
      await this.initialize();
    }

    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
