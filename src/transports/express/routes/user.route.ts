import type { CreateUserUseCase } from '~/domain/users'
import { Router } from 'express'
import { USER_CREATE_USE_CASE } from '~/di/explicit'
import { UserHandler } from '~/transports/express/handlers/user.handler'
import { DiContainerPort } from '~/di/ports/di.container.port'

export function createUserRoutes(container: DiContainerPort): Router {
  const router = Router()

  const createUserUseCase = container.resolve<CreateUserUseCase>(
    USER_CREATE_USE_CASE
  )

  const userHandler = new UserHandler(createUserUseCase)

  router.post('/users', userHandler.create)

  return router
}
