import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import { Role } from '@prisma/client';

import UserController from '~/controllers/UserController';
import JwtMiddleware from '~/middlewares/JwtMiddleware';
import RoleMiddleware from '~/middlewares/RoleMiddleware';

const usersRouter = Router();

usersRouter.get(
  '/',
  JwtMiddleware.handle,
  RoleMiddleware.handle('ADMIN'),
  UserController.index,
);
usersRouter.get(
  '/:id',
  JwtMiddleware.handle,
  celebrate(
    {
      params: Joi.object({
        id: Joi.string()
          .uuid()
          .required(),
      }),
    },
    { abortEarly: false },
  ),
  UserController.show,
);
usersRouter.post(
  '/',
  celebrate(
    {
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
          .required()
          .email(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        referral: Joi.string().allow(null),
        roles: Joi.array().items(
          Joi.string()
            .valid(...Object.values(Role))
            .uppercase(),
        ),
      }),
    },
    { abortEarly: false },
  ),
  UserController.create,
);
usersRouter.put(
  '/:id',
  celebrate(
    {
      params: {
        id: Joi.string()
          .uuid()
          .required(),
      },
      body: Joi.object({
        name: Joi.string(),
        email: Joi.string().email(),
        username: Joi.string(),
        password: Joi.string(),
        referral_id: Joi.string(),
        referral: Joi.string().allow(null),
        roles: Joi.array().items(
          Joi.string()
            .uppercase()
            .valid(...Object.values(Role)),
        ),
      }),
    },
    { abortEarly: false },
  ),
  UserController.update,
);

export default usersRouter;
