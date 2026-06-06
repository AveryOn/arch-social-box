/* eslint-disable @typescript-eslint/no-explicit-any */

export enum DecoratorToken {
  USER_REPO_PORT = 'USER_REPO_PORT',
  USER_CREATE_USE_CASE = 'USER_CREATE_USE_CASE',
  LOGGER = 'LOGGER'
}

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

export interface Function {
  /**
   * Returns the name of the function. Function names are read-only and can not be changed.
   */
  readonly name: string;
}

export type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;

export interface InjectMetadata {
  index: number
  token: DecoratorToken
}

