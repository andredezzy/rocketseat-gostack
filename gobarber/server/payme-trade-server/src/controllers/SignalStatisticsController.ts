import { Request, Response } from 'express';

import SignalsRepository from '~/repositories/SignalsRepository';
import BuildSignalsStatistics from '~/services/BuildSignalsStatisticsService';

class SignalStatisticsController {
  async index(_request: Request, response: Response) {
    const signals = await SignalsRepository.findAll();

    const buildSignalsStatistics = new BuildSignalsStatistics();

    const statistics = buildSignalsStatistics.execute({ signals });

    return response.json(statistics);
  }

  async indexToday(_request: Request, response: Response) {
    const signals = await SignalsRepository.findAllOfToday();

    const buildSignalsStatistics = new BuildSignalsStatistics();

    const statistics = buildSignalsStatistics.execute({ signals });

    return response.json(statistics);
  }
}

export default new SignalStatisticsController();
