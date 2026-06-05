export const ExplicitToken = {
  USER_REPO_PORT: Symbol('USER_REPO_PORT'),
  USER_CREATE_USE_CASE: Symbol('USER_CREATE_USE_CASE'),
  LOGGER: Symbol('LOGGER')
} as const

export type ExplicitToken =
  (typeof ExplicitToken)[keyof typeof ExplicitToken]
