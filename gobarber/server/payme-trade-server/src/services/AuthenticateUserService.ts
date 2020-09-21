import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import AppError from '~/errors/AppError';
import { refreshTokens } from '~/repositories/SessionsRepository';
import UsersRepository, { User } from '~/repositories/UsersRepository';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  access_token: string;
  refresh_token: string;
}

class AuthenticateUserService {
  async execute({ email, password }: Request): Promise<Response> {
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid e-mail or password.', 401);
    }

    const match = await compare(password, user.password);

    if (!match) {
      throw new AppError('Invalid e-mail or password.', 401);
    }

    delete user.password;

    const accessToken = sign(
      { id: user.id },
      String(process.env.ACCESS_TOKEN_SECRET),
      {
        expiresIn: '30m',
      },
    );
    const refreshToken = sign(
      { id: user.id },
      String(process.env.REFRESH_TOKEN_SECRET),
    );

    refreshTokens[user.id] = refreshToken;

    return {
      user,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

export default AuthenticateUserService;
