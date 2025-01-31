export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly address: string,
    public readonly firstName: string,
    public readonly lastName: string
  ) {}
}
