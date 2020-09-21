import { Request, Response } from 'express';

import AppError from '~/errors/AppError';
import SignalsRepository from '~/repositories/SignalsRepository';
import UsersRepository from '~/repositories/UsersRepository';

class StatisticsController {
  async addWin(request: Request, response: Response) {
    const { signalId } = request.params;

    const signalById = await SignalsRepository.findById(signalId);

    if (!signalById) {
      throw new AppError('No signal found with this ID.', 404);
    }

    const user = await UsersRepository.findById(request.user.id);

    const statisticsId = user?.profile.statistics.id;

    if (
      signalById.won_by.some(el => el.id === statisticsId) ||
      signalById.lost_by.some(el => el.id === statisticsId)
    ) {
      throw new AppError(
        "This signal already has an statistic with this user's ID.",
        409,
      );
    }

    const signal = await SignalsRepository.update(signalId, {
      won_by: {
        connect: {
          id: request.user.id,
        },
      },
    });

    return response.json(signal);
  }

  async removeWin(request: Request, response: Response) {
    const { signalId } = request.params;

    const signalById = await SignalsRepository.findById(signalId);

    if (!signalById) {
      throw new AppError('No signal found with this ID.', 404);
    }

    const user = await UsersRepository.findById(request.user.id);

    const statisticsId = user?.profile.statistics.id;

    if (!signalById.won_by.some(el => el.id === statisticsId)) {
      throw new AppError(
        "No found this user's id in this signal statistic.",
        404,
      );
    }

    const signal = await SignalsRepository.update(signalId, {
      won_by: {
        disconnect: {
          id: request.user.id,
        },
      },
    });

    return response.json(signal);
  }

  async addLoss(request: Request, response: Response) {
    const { signalId } = request.params;

    const signalById = await SignalsRepository.findById(signalId);

    if (!signalById) {
      throw new AppError('No signal found with this ID.', 404);
    }

    const user = await UsersRepository.findById(request.user.id);

    const statisticsId = user?.profile.statistics.id;

    if (
      signalById.won_by.some(el => el.id === statisticsId) ||
      signalById.lost_by.some(el => el.id === statisticsId)
    ) {
      throw new AppError(
        "This signal already has an statistic with this user's ID.",
        409,
      );
    }

    const signal = await SignalsRepository.update(signalId, {
      lost_by: {
        connect: {
          id: request.user.id,
        },
      },
    });

    return response.json(signal);
  }

  async removeLoss(request: Request, response: Response) {
    const { signalId } = request.params;

    const signalById = await SignalsRepository.findById(signalId);

    if (!signalById) {
      throw new AppError('No signal found with this ID.', 404);
    }

    const user = await UsersRepository.findById(request.user.id);

    const statisticsId = user?.profile.statistics.id;

    if (!signalById.lost_by.some(el => el.id === statisticsId)) {
      throw new AppError(
        "No found this user's id in this signal statistic.",
        404,
      );
    }

    const signal = await SignalsRepository.update(signalId, {
      lost_by: {
        disconnect: {
          id: request.user.id,
        },
      },
    });

    return response.json(signal);
  }
}

export default new StatisticsController();
