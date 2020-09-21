import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import StatisticsController from '~/controllers/StatisticsController';

const statisticsRouter = Router();

statisticsRouter.patch(
  '/wins/:signalId',
  celebrate(
    {
      params: Joi.object({
        signalId: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  StatisticsController.addWin,
);
statisticsRouter.delete(
  '/wins/:signalId',
  celebrate(
    {
      params: Joi.object({
        signalId: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  StatisticsController.removeWin,
);
statisticsRouter.patch(
  '/losses/:signalId',
  celebrate(
    {
      params: Joi.object({
        signalId: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  StatisticsController.addLoss,
);
statisticsRouter.delete(
  '/losses/:signalId',
  celebrate(
    {
      params: Joi.object({
        signalId: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  StatisticsController.removeLoss,
);

export default statisticsRouter;
