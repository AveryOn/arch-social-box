import type { NextFunction, Request, Response } from 'express'

import type { CreateUserUseCase } from '~/domain/users'

export class UserHandler {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  create = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const user = await this.createUserUseCase.execute(request.body)

      response.status(201).json({
        data: user
      })
    } catch (error) {
      next(error)
    }
  }
}
