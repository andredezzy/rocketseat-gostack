import { Request, Response } from 'express';

import AuthenticateUserService from '~/services/AuthenticateUserService';
import CreateRecoveryPasswordRequest from '~/services/CreateRecoveryPasswordRequestService';
import DeleteSessionService from '~/services/DeleteSessionService';
import RecoveryPasswordService from '~/services/RecoveryPasswordService';
import UpdateSessionService from '~/services/UpdateSessionService';

class SessionController {
  async create(request: Request, response: Response) {
    const { email, password } = request.body;

    const authenticateUser = new AuthenticateUserService();

    const {
      user,
      access_token,
      refresh_token,
    } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user, access_token, refresh_token });
  }

  async update(request: Request, response: Response) {
    const { token } = request.body;

    const updateSession = new UpdateSessionService();

    const { access_token } = await updateSession.execute({ token });

    return response.json({ access_token });
  }

  async delete(request: Request, response: Response) {
    const { token } = request.body;

    const destroySession = new DeleteSessionService();

    await destroySession.execute({ token });

    return response.json({ message: 'Successfully logged out.' });
  }

  async forgotPassword(request: Request, response: Response) {
    const { email } = request.body;

    const createRecoveryPasswordRequest = new CreateRecoveryPasswordRequest();

    await createRecoveryPasswordRequest.execute({ email });

    return response.json({ message: 'E-mail successfully sent.' });
  }

  async recoveryPassword(request: Request, response: Response) {
    const { token, password } = request.body;

    const recoveryPassword = new RecoveryPasswordService();

    await recoveryPassword.execute({ token, password });

    return response.json({ message: 'Password successfully recovered.' });
  }
}

export default new SessionController();
