import type { ExplicitToken } from '~/di/explicit/di.explicit.token'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassConstructor<T = unknown> = new (...args: any[]) => T

export type ExplicitValueProvider<T = unknown> = {
  token: ExplicitToken
  useValue: T
}

export type ExplicitClassProvider<T = unknown> = {
  token: ExplicitToken
  useClass: ClassConstructor<T>
  inject?: ExplicitToken[]
}

export type ExplicitFactoryProvider<T = unknown> = {
  token: ExplicitToken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useFactory: (...dependencies: any[]) => T
  inject?: ExplicitToken[]
}

export type ExplicitProvider<T = unknown> =
  | ExplicitValueProvider<T>
  | ExplicitClassProvider<T>
  | ExplicitFactoryProvider<T>
