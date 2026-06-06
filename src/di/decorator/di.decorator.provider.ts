/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DecoratorToken } from '~/di/decorator'

export type ClassConstructor<T = unknown> = new  (...args: any[]) => T

export type DecoratorProvider =
  | ClassProvider
  | ValueProvider
  | FactoryProvider

export interface ClassProvider {
  token: DecoratorToken,
  useClass: ClassConstructor
}

export interface ValueProvider {
  token: DecoratorToken
  useValue: unknown
}

export interface FactoryProvider {
  token: DecoratorToken,
  useFactory: (...ars: unknown[]) => unknown,
  inject?: DecoratorToken[]
}
