import { Router } from 'express';

import SignalStatisticsController from '~/controllers/SignalStatisticsController';
import JwtMiddleware from '~/middlewares/JwtMiddleware';

const signalsRouter = Router();

signalsRouter.use(JwtMiddleware.handle);

signalsRouter.get('/', SignalStatisticsController.index);
signalsRouter.get('/today', SignalStatisticsController.indexToday);

export default signalsRouter;
