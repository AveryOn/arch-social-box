import { AsyncLocalStorage } from 'node:async_hooks'
import { fork, type ChildProcess } from 'node:child_process'
import { RequestLogContext, type LogEvent, type LogLevel } from '~/shared/logger'

export class Logger {
  static logContext = new AsyncLocalStorage<RequestLogContext>()

  constructor(
    private readonly scopeName?: string,
    private readonly worker?: ChildProcess
  ) {}

  static create(): Logger {
    const worker = fork(new URL('./logger.worker.js', import.meta.url))

    return new Logger(undefined, worker)
  }

  scope(scopeName: string): Logger {
    return new Logger(scopeName, this.worker)
  }

  debug(message: string, options?: LogOptions): void {
    this.log('debug', message, options)
  }

  info(message: string, options?: LogOptions): void {
    this.log('info', message, options)
  }

  warn(message: string, options?: LogOptions): void {
    this.log('warn', message, options)
  }

  error(message: string, options?: LogOptions): void {
    this.log('error', message, options)
  }

  fatal(message: string, options?: LogOptions): void {
    this.log('fatal', message, options)
  }

  private log(
    level: LogLevel,
    message: string,
    options?: LogOptions
  ): void {
    const context = Logger.logContext.getStore()

    const event: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      scope: this.scopeName,
      requestId: context?.requestId,
      traceId: context?.traceId,
      details: options?.details,
      callstack:
        options?.callstack === true ? new Error().stack : undefined,
      pid: process.pid
    }
    this.worker?.send(event)
  }
}

export interface LogOptions {
  details?: Record<string, unknown>
  callstack?: boolean
}
