import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import SessionController from '~/controllers/SessionController';

const sessionsRouter = Router();

sessionsRouter.post(
  '/',
  celebrate(
    {
      body: Joi.object({
        email: Joi.string()
          .required()
          .email(),
        password: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  SessionController.create,
);
sessionsRouter.put(
  '/',
  celebrate(
    {
      body: Joi.object({
        token: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  SessionController.update,
);
sessionsRouter.delete(
  '/',
  celebrate(
    {
      body: Joi.object({
        token: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  SessionController.delete,
);
sessionsRouter.post(
  '/forgot-password',
  celebrate(
    {
      body: Joi.object({
        email: Joi.string()
          .email()
          .required(),
      }),
    },
    { abortEarly: false },
  ),
  SessionController.forgotPassword,
);
sessionsRouter.post(
  '/recovery-password',
  celebrate(
    {
      body: Joi.object({
        token: Joi.string().required(),
        password: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  SessionController.recoveryPassword,
);

export default sessionsRouter;
