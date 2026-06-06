import express from 'express'
import { createUserRoutes } from '~/transports/express/routes/user.route'
import {
  ServerPort,
  ServerPortConfig
} from '~/transports/ports/server.port'
import { env } from '~/config/env'
import { logContext, Logger } from '~/shared/logger'

export class ExpressServer extends ServerPort {
  private server: express.Express

  constructor(
    protected readonly config: ServerPortConfig,
    private readonly logger: Logger
  ) {
    super(config)
    this.server = express()
    this.initMiddlewares()
    this.initHandlers()
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(env.APP_PORT, env.APP_HOST, () => {
        this.logger.info(
          `Server started: http://${this.config.host}:${this.config.port}`
        )
        resolve()
      })
    })
  }

  stop(): Promise<void> {
    return Promise.resolve(void 0)
  }

  initHandlers(): void {
    this.server.get('/health', (_request, response) => {
      this.logger.info('HEALTH REQUEST GO...')
      response.json({
        status: 'ok'
      })
    })
    this.server.use('/api', createUserRoutes(this.config.DIContainer))
  }
  initMiddlewares(): void {
    this.server.use(express.json())
    this.server.use((_req, _res, next) => {
      logContext.run({ requestId: crypto.randomUUID() }, () => {
        next()
      })
    })
    this.server.use(
      (
        error: unknown,
        _request: express.Request,
        response: express.Response,
        _next: express.NextFunction
      ) => {
        const message =
          error instanceof Error ? error.message : 'Internal server error'

        response.status(500).json({
          error: message
        })
      }
    )
  }
}
