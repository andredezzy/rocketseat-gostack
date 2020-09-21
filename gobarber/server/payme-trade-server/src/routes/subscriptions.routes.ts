import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import SubscriptionsController from '~/controllers/SubscriptionsController';
import JwtMiddleware from '~/middlewares/JwtMiddleware';
import RoleMiddleware from '~/middlewares/RoleMiddleware';

const subscriptionsRouter = Router();

subscriptionsRouter.get(
  '/',
  JwtMiddleware.handle,
  RoleMiddleware.handle('ADMIN'),
  SubscriptionsController.index,
);
subscriptionsRouter.post(
  '/',
  celebrate({
    body: Joi.object({
      checkout_json: Joi.string().required(),
    }),
  }),
  SubscriptionsController.create,
);
subscriptionsRouter.post('/postback', SubscriptionsController.postback);

export default subscriptionsRouter;
