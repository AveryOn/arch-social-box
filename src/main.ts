import { env } from '~/config/env'
import { createExplicitModule } from '~/di/explicit/di.explicit.module'
import { Logger } from '~/shared/logger'
import { ExpressServer } from '~/transports/express/express.server'

const expressServer = new ExpressServer({
  DIContainer: createExplicitModule(),
  host: env.APP_HOST,
  port: env.APP_PORT
}, Logger.create())

expressServer.start()
