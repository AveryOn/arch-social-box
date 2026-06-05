import { CreateUserUseCase } from '~/domain/users'
import { UserRepoAdapter } from '~/database/in-memory/repositories/user.repo.adapter'

import { ExplicitContainer, ExplicitToken } from '~/di/explicit'

export function createExplicitModule(): ExplicitContainer {
  const container = new ExplicitContainer()

  container.register([
    {
      token: ExplicitToken.USER_REPO_PORT,
      useClass: UserRepoAdapter
    },
    {
      token: ExplicitToken.USER_CREATE_USE_CASE,
      useClass: CreateUserUseCase,
      inject: [ExplicitToken.USER_REPO_PORT]
    }
  ])

  return container
}
