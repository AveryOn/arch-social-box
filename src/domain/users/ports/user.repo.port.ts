import type { User } from '~/domain/users/application/user.entity'

export abstract class UserRepoPort {
  abstract findByEmail(email: string): Promise<User | null>
  abstract save(user: User): Promise<void>
}
