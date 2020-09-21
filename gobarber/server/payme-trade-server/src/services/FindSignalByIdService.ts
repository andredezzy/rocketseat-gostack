import AppError from '~/errors/AppError';
import SignalsRepository, { Signal } from '~/repositories/SignalsRepository';

interface Request {
  signalId: string;
}

class FindSignalByIdService {
  async execute({ signalId }: Request): Promise<Signal> {
    const signal = await SignalsRepository.findById(signalId);

    if (!signal) {
      throw new AppError('No signal found with this ID.', 404);
    }

    return signal;
  }
}

export default FindSignalByIdService;
