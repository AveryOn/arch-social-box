import type { User, UserRepoPort } from '~/domain/users'

export class UserRepoAdapter implements UserRepoPort {
  private readonly users = new Map<string, User>()

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }

    return null
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user)
  }
}
