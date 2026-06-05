import { ExplicitContainer } from '~/di/explicit'

export interface ServerPortConfig {
  DIContainer: ExplicitContainer
  host: string
  port: number
}

export abstract class ServerPort {
  constructor(protected readonly config: ServerPortConfig) {}
  abstract start(): Promise<void>
  abstract stop(): Promise<void>
  abstract initHandlers(): void
  abstract initMiddlewares(): void
}
