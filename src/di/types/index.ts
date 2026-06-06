/* eslint-disable @typescript-eslint/no-explicit-any */

export type DiToken = string | symbol

export type ClassConstructor<T = unknown> = new (...deps: any[]) => T

export type ValueDiProvider<T = unknown> = {
  token: DiToken
  useValue: T
}

export interface ClassDiProvider<T = unknown> {
  token: DiToken
  useClass: ClassConstructor<T>
  inject?: DiToken[]
}

export interface FactoryDiProvider<T = unknown> {
  token: DiToken
  useFactory: (...dependencies: any[]) => T
  inject?: DiToken[]
}

export type DiProvider<T = unknown> =
  | ClassDiProvider
  | ValueDiProvider<T>
  | FactoryDiProvider<T>

export interface InjectMetadata {
  index: number
  token: DiToken
}

export * from '~/di/types/lib.type'
