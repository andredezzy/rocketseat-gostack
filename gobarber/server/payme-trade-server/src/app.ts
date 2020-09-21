import 'dotenv/config';

import bodyParser from 'body-parser';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import socketio, { ConnectedUsers } from 'socket.io';

import 'express-async-errors';

import AppError from './errors/AppError';
import SocketIOMiddleware from './middlewares/SocketIOMiddleware';
import routes from './routes';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const connectedUsers: ConnectedUsers = {};

io.on('connection', socket => {
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;

  console.log('\nNew connection in the channel, socket:', socket.id);
  console.log('Connected users: ', connectedUsers);

  socket.on('join', room => {
    console.log(`\nUser '${user_id}' joined to room: ${room}.`);
    socket.join(room);
  });

  socket.on('disconnect', () => {
    delete connectedUsers[user_id];

    console.log('\nDisconnected socket:', socket.id);
    console.log('Connected users: ', connectedUsers);
  });
});

app.use(cors({ exposedHeaders: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(SocketIOMiddleware.handle(io, connectedUsers));

app.use(routes);

app.use(errors());
app.use(
  (err: Error, _request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return response
      .status(500)
      .json({ status: 'error', message: 'Internal server error' });
  },
);

export default server;
