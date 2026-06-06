import { CreateUserUseCase } from '~/domain/users'
import { UserRepoAdapter } from '~/database/in-memory/repositories/user.repo.adapter'
import { ExplicitContainer } from '~/di/explicit'
import { Logger } from '~/shared/logger/logger.client'

export const USER_REPO_PORT = Symbol('USER_REPO_PORT')
export const USER_CREATE_USE_CASE = Symbol('USER_CREATE_USE_CASE')
export const LOGGER = Symbol('LOGGER')

export function createExplicitModule(): ExplicitContainer {
  const container = new ExplicitContainer()

  container.register([
    {
      token: USER_REPO_PORT,
      useClass: UserRepoAdapter
    },
    {
      token: USER_CREATE_USE_CASE,
      useClass: CreateUserUseCase,
      inject: [USER_REPO_PORT]
    },
    {
      token: LOGGER,
      useValue: Logger.create()
    }
  ])

  return container
}
