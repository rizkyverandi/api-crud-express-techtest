export class CreateUserRequest {
  constructor(
    public readonly email: string,
    public readonly address: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}
