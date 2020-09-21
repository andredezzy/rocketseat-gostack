import { Request, Response } from 'express';

import CreateMessageService from '~/services/CreateMessageService';

class MessageController {
  async create(request: Request, response: Response) {
    const { user_id, content } = request.body;

    const createMessage = new CreateMessageService();

    const message = await createMessage.execute({ user_id, content });

    request.io.to('messages').emit('new', message);

    return response.json(message);
  }
}

export default new MessageController();
