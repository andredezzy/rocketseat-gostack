import { Request, Response, NextFunction } from 'express';
import { Server, ConnectedUsers } from 'socket.io';

class SocketIOMiddleware {
  handle(
    io: Server,
    connectedUsers: ConnectedUsers,
  ): (request: Request, response: Response, next: NextFunction) => any {
    return (request: Request, _: Response, next: NextFunction): any => {
      request.io = io;
      request.connectedUsers = connectedUsers;

      return next();
    };
  }
}

export default new SocketIOMiddleware();
