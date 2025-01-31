import { randomUUID } from "crypto";

export default class User{
    constructor(
        public readonly email: string = null!,
        public readonly address: string = null!,
        public readonly firstName: string = null!,
        public readonly lastName: string = null!,
        public readonly id: string = randomUUID(),
    ) { }
}