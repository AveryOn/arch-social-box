import { env } from '~/config/env'
import { createExplicitModule } from '~/di/explicit/di.explicit.module'
import { ExpressServer } from '~/transports/express/express.server'

const server = new ExpressServer({
  DIContainer: createExplicitModule(),
  host: env.APP_HOST,
  port: env.APP_PORT
})

server.start()
