/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server, ConnectedUsers } from 'socket.io';

import { User } from '~/repositories/UsersRepository';

declare global {
  namespace Express {
    interface Request {
      io: Server;
      connectedUsers: ConnectedUsers;
      user: { id: string };
    }
  }
}
