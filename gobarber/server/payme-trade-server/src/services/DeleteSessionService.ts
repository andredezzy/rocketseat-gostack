import AppError from '~/errors/AppError';
import { verify } from '~/middlewares/JwtMiddleware';
import { refreshTokens } from '~/repositories/SessionsRepository';

interface Request {
  token: string;
}

class DeleteSessionService {
  async execute({ token }: Request): Promise<void> {
    try {
      const user = verify(token, String(process.env.ACCESS_TOKEN_SECRET));

      if (user) {
        const refreshToken = refreshTokens[user.id];

        if (refreshToken) delete refreshTokens[user.id];
      }
    } catch (err) {
      throw new AppError('Invalid refresh token (JWT).', 401);
    }
  }
}

export default DeleteSessionService;
