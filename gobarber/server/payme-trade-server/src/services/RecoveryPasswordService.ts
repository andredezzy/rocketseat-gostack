import { hash } from 'bcrypt';

import AppError from '~/errors/AppError';
import RecoveryPasswordRequestsRepository from '~/repositories/RecoveryPasswordRequestsRepository';
import UsersRepository from '~/repositories/UsersRepository';

interface Request {
  token: string;
  password: string;
}

class UpdateSessionService {
  async execute({ token, password }: Request): Promise<void> {
    const recoveryPasswordRequest = await RecoveryPasswordRequestsRepository.findByToken(
      token,
    );

    if (!recoveryPasswordRequest) {
      throw new AppError(
        'No recovery password request found with this token.',
        404,
      );
    }

    if (recoveryPasswordRequest.recovered) {
      throw new AppError('This token has been already used.', 401);
    }

    await RecoveryPasswordRequestsRepository.update(
      recoveryPasswordRequest.id,
      {
        recovered: true,
      },
    );

    const passwordHash = await hash(password, 10);

    await UsersRepository.update(recoveryPasswordRequest.user.id, {
      password: passwordHash,
    });
  }
}

export default UpdateSessionService;
