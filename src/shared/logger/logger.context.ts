import { AsyncLocalStorage } from 'node:async_hooks'

export interface RequestLogContext {
  requestId: string
  traceId?: string
}

export const logContext = new AsyncLocalStorage<RequestLogContext>()
