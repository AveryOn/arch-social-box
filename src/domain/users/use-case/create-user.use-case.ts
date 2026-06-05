import { randomUUID } from 'node:crypto'

import { User } from '~/domain/users/application/user.entity'
import type { UserRepoPort } from '~/domain/users/ports/user.repo.port'

export type CreateUserInput = {
  email: string
  name: string
}

export class CreateUserUseCase {
  constructor(private readonly userRepo: UserRepoPort) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepo.findByEmail(input.email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const user = User.create({
      id: randomUUID(),
      email: input.email,
      name: input.name
    })

    await this.userRepo.save(user)

    return user
  }
}
