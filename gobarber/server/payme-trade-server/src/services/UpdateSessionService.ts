import { sign } from 'jsonwebtoken';

import AppError from '~/errors/AppError';
import { verify } from '~/middlewares/JwtMiddleware';
import { refreshTokens } from '~/repositories/SessionsRepository';

interface Request {
  token: string;
}

interface Response {
  access_token: string;
}

class UpdateSessionService {
  async execute({ token }: Request): Promise<Response> {
    if (!Object.values(refreshTokens).includes(token)) {
      throw new AppError('Invalid refresh token (JWT).', 401);
    }

    try {
      const decoded: any = verify(
        token,
        String(process.env.REFRESH_TOKEN_SECRET),
      );

      delete decoded.iat;
      delete decoded.exp;
      delete decoded.nbf;

      const accessToken = sign(
        decoded,
        String(process.env.ACCESS_TOKEN_SECRET),
        {
          expiresIn: '30m',
        },
      );

      return { access_token: accessToken };
    } catch (err) {
      throw new AppError('Invalid refresh token (JWT).', 401);
    }
  }
}

export default UpdateSessionService;
