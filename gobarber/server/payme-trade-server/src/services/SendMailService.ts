import Mail from 'nodemailer/lib/mailer';

import Mailer from '~/config/mailer';
import AppError from '~/errors/AppError';

class SendMailService {
  async execute(options: Mail.Options): Promise<boolean> {
    try {
      await Mailer.sendMail({
        ...options,
        from: `Payme Trade <${process.env.MAIL_USER}>`,
      });

      return true;
    } catch (err) {
      console.error(err);
      throw new AppError(
        'Occurred an unexpected error while trying to send mail.',
        500,
      );
    }
  }
}

export default SendMailService;
