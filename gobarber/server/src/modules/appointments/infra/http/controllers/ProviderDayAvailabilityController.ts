import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderDayAvalabityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { day, month, year } = request.query;

    const listProviderDayAvailabity = container.resolve(
      ListProviderDayAvalabityService,
    );

    const availability = await listProviderDayAvailabity.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
