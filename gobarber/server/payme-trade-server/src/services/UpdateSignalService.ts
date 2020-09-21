import { SignalUpdateInput } from '@prisma/client';

import AppError from '~/errors/AppError';
import SignalsRepository, { Signal } from '~/repositories/SignalsRepository';

import FindSignalByIdService from './FindSignalByIdService';

interface Request {
  signalId: string;
  data: SignalUpdateInput;
}

class UpdateSignalService {
  async execute({ signalId, data }: Request): Promise<Signal> {
    const findSignalById = new FindSignalByIdService();

    const signal = await findSignalById.execute({ signalId });

    const updatedSignal = await SignalsRepository.update(signal.id, data);

    if (!updatedSignal) {
      throw new AppError(
        `It was not possible to update signal (id: ${signalId}).`,
        500,
      );
    }

    return updatedSignal;
  }
}

export default UpdateSignalService;
