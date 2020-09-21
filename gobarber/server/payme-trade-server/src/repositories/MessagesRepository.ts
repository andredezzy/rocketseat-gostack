import { uuid } from 'uuidv4';

import Repository from './Repository';
import { User } from './UsersRepository';

export interface Message {
  id: string;
  user: User;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const messages: Message[] = [];

class SubscriptionsRepository extends Repository<Message, any, any> {
  async findAll(): Promise<Message[]> {
    return messages;
  }

  async findById(id: string): Promise<Message | null> {
    return messages.find(message => message.id === id) || null;
  }

  async create(data: any): Promise<Message | null> {
    const newMessage = {
      ...data,
      id: uuid(),
      created_at: new Date(),
      updated_at: new Date(),
    };

    messages.push(newMessage);

    return newMessage;
  }

  async update(id: string, data: any): Promise<Message | null> {
    const messageIndex = messages.findIndex(message => message.id === id);

    if (messageIndex < 0) {
      throw new Error('No message found with this ID.');
    }

    messages[messageIndex] = {
      ...messages[messageIndex],
      ...data,
      updated_at: new Date(),
    };

    return messages[messageIndex];
  }

  async delete(id: string): Promise<Message | null> {
    const messageIndex = messages.findIndex(message => message.id === id);

    if (messageIndex < 0) {
      throw new Error('No message found with this ID.');
    }

    const message = messages[messageIndex];

    delete messages[messageIndex];

    return message;
  }

  async existsById(id: string): Promise<boolean> {
    const messageIndex = messages.findIndex(message => message.id === id);

    return messageIndex >= 0;
  }
}

export default new SubscriptionsRepository();
