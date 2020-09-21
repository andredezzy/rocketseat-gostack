import crypto from 'crypto';

import AppError from '~/errors/AppError';
import RecoveryPasswordRequestsRepository from '~/repositories/RecoveryPasswordRequestsRepository';
import UsersRepository from '~/repositories/UsersRepository';

import SendMailService from './SendMailService';

interface Request {
  email: string;
}

class UpdateSessionService {
  async execute({ email }: Request): Promise<void> {
    const user = await UsersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('No users found with this e-mail.', 404);
    }

    const token = crypto.randomBytes(64).toString('hex');
    const recoveryPasswordClientUrl = `${process.env.CLIENT_URL}/recovery-password?token=${token}`;

    const sendMail = new SendMailService();

    await sendMail.execute({
      to: user.email,
      subject: 'Recuperar senha',
      html:
        '<p>Olá!</p>' +
        `<p>Para recuperar sua senha, utilize o link a seguir: <a href="${recoveryPasswordClientUrl}">${recoveryPasswordClientUrl}</a><p/>`,
    });

    await RecoveryPasswordRequestsRepository.create({
      user: { connect: { id: user.id } },
      token,
    });
  }
}

export default UpdateSessionService;
