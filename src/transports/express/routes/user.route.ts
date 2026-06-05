import type { CreateUserUseCase } from '~/domain/users'
import { Router } from 'express'
import { ExplicitToken, type ExplicitContainer } from '~/di/explicit'
import { UserHandler } from '~/transports/express/handlers/user.handler'

export function createUserRoutes(container: ExplicitContainer): Router {
  const router = Router()

  const createUserUseCase = container.resolve<CreateUserUseCase>(
    ExplicitToken.USER_CREATE_USE_CASE
  )

  const userHandler = new UserHandler(createUserUseCase)

  router.post('/users', userHandler.create)

  return router
}
