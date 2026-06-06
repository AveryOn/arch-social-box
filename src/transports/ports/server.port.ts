import { DiContainerPort } from '~/di/ports/di.container.port'

export interface ServerPortConfig {
  DIContainer: DiContainerPort
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
