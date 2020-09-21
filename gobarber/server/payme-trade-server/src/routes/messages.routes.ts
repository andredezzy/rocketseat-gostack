import { celebrate, Joi } from 'celebrate';
import { Router } from 'express';

import MessageController from '~/controllers/MessageController';

const messagesRouter = Router();

messagesRouter.post(
  '/',
  celebrate(
    {
      body: Joi.object({
        user_id: Joi.string()
          .required()
          .uuid(),
        content: Joi.string().required(),
      }),
    },
    { abortEarly: false },
  ),
  MessageController.create,
);

export default messagesRouter;
