import { Router } from 'express';

import messagesRouter from './messages.routes';
import sessionsRouter from './sessions.routes';
import signalsStatisticsRouter from './signals_statistics.routes';
import signalsRouter from './signals.routes';
import statisticsRouter from './statistics.routes';
import subscriptionsRouter from './subscriptions.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/signals/statistics', signalsStatisticsRouter);
routes.use('/signals', signalsRouter);
routes.use('/statistics', statisticsRouter);
routes.use('/subscriptions', subscriptionsRouter);
routes.use('/users', usersRouter);
routes.use('/messages', messagesRouter);

routes.get('/', (request, response) => {
  return response.json({
    name: 'Payme Trade API',
    version: '0.0.1',
  });
});

routes.get('/ping', (request, response) => {
  return response.json({ message: 'Pong' });
});

export default routes;
