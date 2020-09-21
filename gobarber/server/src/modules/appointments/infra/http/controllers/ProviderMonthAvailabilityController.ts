import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabityService from '@modules/appointments/services/ListProviderMonthAvailabityService';

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params;
    const { month, year } = request.query;

    const listProviderMonthAvailabity = container.resolve(
      ListProviderMonthAvailabityService,
    );

    const availability = await listProviderMonthAvailabity.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}
