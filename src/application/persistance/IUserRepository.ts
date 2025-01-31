import User from "../../domain/User/User";


export interface IUserRepository {
  Add(user: User): Promise<void>;
  Get(email: string): Promise<User | null>;
  Delete(email: string): Promise<void>;
  Update(user: User): Promise<void>;
  GetAll(): Promise<User[] | null>;
}
