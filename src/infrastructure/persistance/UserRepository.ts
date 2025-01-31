import User from "../../domain/User/User";
import { injectable } from "inversify";
import { IUserRepository } from "../../application/persistance/IUserRepository";

@injectable()
export default class UserRepository implements IUserRepository {
  private static _user: User[] = [];
  public async Add(user: User): Promise<void> {
    UserRepository._user.push(user);
  }

  public async Get(email: string): Promise<User | null> {
    const user = UserRepository._user.find((user) => user.email === email) || null; 
    return user; 
  }

  public async Delete(email: string): Promise<void> {
    UserRepository._user = UserRepository._user.filter((user) => user.email !== email);
  }

  public async Update(user: User): Promise<void> {
    UserRepository._user = UserRepository._user.map((u) => (u.email === user.email ? user : u));
  }

  public async GetAll(): Promise<User[] | null> {
    return UserRepository._user;
  }
}
