import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import SignalController from '~/controllers/SignalController';
import JwtMiddleware from '~/middlewares/JwtMiddleware';
import RoleMiddleware from '~/middlewares/RoleMiddleware';

const signalsRouter = Router();

signalsRouter.use(JwtMiddleware.handle);

signalsRouter.get('/', SignalController.index);
signalsRouter.get(
  '/today',
  celebrate(
    {
      query: Joi.object({
        page: Joi.number(),
        rowsPerPage: Joi.number(),
      }),
    },
    { abortEarly: false },
  ),
  SignalController.indexToday,
);
signalsRouter.get(
  '/:id',
  celebrate(
    {
      params: Joi.object({
        id: Joi.number().required(),
      }),
    },
    { abortEarly: false },
  ),
  SignalController.show,
);
signalsRouter.post(
  '',
  RoleMiddleware.handle(['ADMIN', 'MANAGER']),
  celebrate(
    {
      body: Joi.array().items(
        Joi.object({
          currency: Joi.string().required(),
          date: Joi.date().required(),
          operation: Joi.string()
            .valid('CALL')
            .valid('PUT')
            .uppercase()
            .required(),
          expiration: Joi.string()
            .valid('M1')
            .valid('M5')
            .valid('M15')
            .valid('M30')
            .valid('H1')
            .uppercase()
            .required(),
        }),
      ),
    },
    { abortEarly: false },
  ),
  SignalController.create,
);
signalsRouter.put(
  '/:id',
  RoleMiddleware.handle(['ADMIN', 'MANAGER']),
  celebrate(
    {
      body: Joi.object({
        currency: Joi.string(),
        date: Joi.date(),
        operation: Joi.string().valid('CALL').valid('PUT').uppercase(),
        expiration: Joi.string()
          .valid('M1')
          .valid('M5')
          .valid('M15')
          .valid('M30')
          .valid('H1')
          .uppercase(),
        result: Joi.string().valid('WIN').valid('LOSS').valid(null).uppercase(),
        gales: Joi.number().min(0).max(2),
      }),
    },
    { abortEarly: false },
  ),
  SignalController.update,
);
signalsRouter.delete(
  '/:id',
  RoleMiddleware.handle(['ADMIN', 'MANAGER']),
  celebrate(
    {
      params: Joi.object({
        id: Joi.number().required(),
      }),
    },
    { abortEarly: false },
  ),
  SignalController.delete,
);

export default signalsRouter;
