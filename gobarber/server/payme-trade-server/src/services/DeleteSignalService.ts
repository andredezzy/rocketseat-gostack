import AppError from '~/errors/AppError';
import SignalsRepository, { Signal } from '~/repositories/SignalsRepository';

import FindSignalByIdService from './FindSignalByIdService';

interface Request {
  signalId: string;
}

class UpdateSessionService {
  async execute({ signalId }: Request): Promise<Signal> {
    const findSignalById = new FindSignalByIdService();

    const signal = await findSignalById.execute({ signalId });

    const deletedSignal = await SignalsRepository.delete(signal.id);

    if (!deletedSignal) {
      throw new AppError(
        `It was not possible to delete signal (id: ${signalId}).`,
        500,
      );
    }

    return deletedSignal;
  }
}

export default UpdateSessionService;
