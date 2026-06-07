import 'reflect-metadata'
import { env } from '~/config/env'
import { UserRepoAdapter } from '~/database/in-memory/repositories/user.repo.adapter'
import { DiModule } from '~/di/di.module'
import { LOGGER, USER_CREATE_USE_CASE, USER_REPO_PORT } from '~/di/explicit'
import { CreateUserUseCase } from '~/domain/users'
import { Logger } from '~/shared/logger'
import { ExpressServer } from '~/transports/express/express.server'

const DI = new DiModule(env.DI_MODE)
const logger = Logger.create()

const expressServer = new ExpressServer(
  {
    DIContainer: DI.bootstrap([
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
        useValue: logger
      }
    ]),
    host: env.APP_HOST,
    port: env.APP_PORT
  },
  logger
)

expressServer.start()
