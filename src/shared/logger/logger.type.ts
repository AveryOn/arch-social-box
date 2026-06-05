export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEvent {
  timestamp: string
  level: LogLevel

  message: string

  scope?: string
  requestId?: string
  traceId?: string

  details?: Record<string, unknown>

  callstack?: string

  pid: number
}
