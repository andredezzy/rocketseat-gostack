/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '~/repositories/UsersRepository';

declare global {
  namespace SocketIO {
    interface Socket {
      user: User;
    }

    type ConnectedUsers = { [key: string]: string };
  }
}
