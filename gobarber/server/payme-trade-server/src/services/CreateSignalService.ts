import { Operation, Expiration, Role } from '@prisma/client';

import AppError from '~/errors/AppError';
import SignalsRepository, { Signal } from '~/repositories/SignalsRepository';

interface Request {
  currency: string;
  date: string | Date;
  operation: Operation;
  expiration: Expiration;
}

class CreateSignalService {
  async execute({
    currency,
    date,
    operation,
    expiration,
  }: Request): Promise<Signal> {
    const randomNumber = Math.floor(Math.random() * 100) + 1;

    let roles: Role[] = ['ADMIN', 'MANAGER', 'MODERATOR', 'VIP'];

    if (randomNumber % 3 === 0) {
      roles = [];
    }

    const signal = await SignalsRepository.create({
      currency,
      date,
      operation,
      expiration,
      availableFor: {
        set: roles,
      },
    });

    if (!signal) {
      throw new AppError('It was not possible to create a new signal.', 500);
    }

    return signal;
  }
}

export default CreateSignalService;
