import { Request, Response, NextFunction } from 'express';

import { Role } from '@prisma/client';

import AppError from '~/errors/AppError';
import UsersRepository from '~/repositories/UsersRepository';

class RoleMiddleware {
  handle(
    role: Role | Role[],
  ): (request: Request, response: Response, next: NextFunction) => any {
    const roles: Role[] = Array.isArray(role) ? role : [role];

    return async (
      request: Request,
      _: Response,
      next: NextFunction,
    ): Promise<void> => {
      if (!request.user) {
        throw new AppError("'request.user' not found.", 500);
      }

      const user = await UsersRepository.findById(request.user.id);

      if (!user || !user.profile.roles.some(item => roles.includes(item))) {
        throw new AppError("You can't access this route.", 403);
      }

      return next();
    };
  }
}

export default new RoleMiddleware();
