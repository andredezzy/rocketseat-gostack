import AppError from '~/errors/AppError';
import MessagesRepository, { Message } from '~/repositories/MessagesRepository';

import FindUserByIdService from './FindUserByIdService';

interface Request {
  user_id: string;
  content: string;
}

class CreateMessageService {
  async execute({ user_id, content }: Request): Promise<Message> {
    const findUserById = new FindUserByIdService();

    const user = await findUserById.execute({ user_id });

    const message = await MessagesRepository.create({
      user,
      content,
    });

    if (!message) {
      throw new AppError('It was not possible to create a new user.', 500);
    }

    return message;
  }
}

export default CreateMessageService;
