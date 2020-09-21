import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import AppError from '~/errors/AppError';

export function verify(token: string, secret: string): { id: string } | null {
  try {
    const decoded = jwt.verify(token, secret);

    if (!decoded) return null;

    const user = decoded as { id: string };

    return user;
  } catch (err) {
    return null;
  }
}

class JwtMiddleware {
  handle(request: Request, _response: Response, next: NextFunction): any {
    if (request.path.includes('/sessions')) return next();

    const authToken = request.headers.authorization;

    if (!authToken) {
      throw new AppError(
        'Authorization token (JWT) not found on headers.',
        401,
      );
    }

    const [, token] = authToken?.split(' ');

    const user = verify(token, String(process.env.ACCESS_TOKEN_SECRET));

    if (!user) {
      throw new AppError('Invalid access token (JWT).', 401);
    }

    request.user = user;

    return next();
  }
}

export default new JwtMiddleware();
