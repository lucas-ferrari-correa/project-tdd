import { User } from "../../domain/entities/user";

export class FakeUserRepository {
  private users: User[] = [
    new User('1', 'John Doe'),
    new User('2', 'Jane Smith'),
  ]

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.getId() === id) || null
  }

  async save(user: User) {
    this.users.push(user)
  }
}