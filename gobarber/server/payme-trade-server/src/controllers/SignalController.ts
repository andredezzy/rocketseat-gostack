import { Request, Response } from 'express';

import { SignalCreateInput } from '@prisma/client';

import SignalsRepository, { Signal } from '~/repositories/SignalsRepository';
import CreateSignalService from '~/services/CreateSignalService';
import DeleteSignalService from '~/services/DeleteSignalService';
import FilterSignalsByRolesService from '~/services/FilterSignalsByRolesService';
import FindSignalByIdService from '~/services/FindSignalByIdService';
import FindUserByIdService from '~/services/FindUserByIdService';
import SerializeSignalService from '~/services/SerializeSignalService';
import UpdateSignalService from '~/services/UpdateSignalService';

class SignalController {
  async index(_request: Request, response: Response) {
    const signals = await SignalsRepository.findAll();

    const serializeSignal = new SerializeSignalService();

    const serializedSignals = signals.map(signal =>
      serializeSignal.execute({ originalSignal: signal }),
    );

    return response.json(serializedSignals);
  }

  async indexToday(request: Request, response: Response) {
    const { page = 1, rowsPerPage = 16 } = request.query;

    const findUserById = new FindUserByIdService();

    const user = await findUserById.execute({ user_id: request.user.id });

    let signalsWithoutPagination = await SignalsRepository.findAllOfToday();
    let signals = await SignalsRepository.findAllOfToday({
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
    });

    const filterSignalsByRoles = new FilterSignalsByRolesService();

    signalsWithoutPagination = filterSignalsByRoles.execute({
      signals: signalsWithoutPagination,
      roles: user.profile.roles,
    });

    signals = filterSignalsByRoles.execute({
      signals,
      roles: user.profile.roles,
    });

    const serializeSignal = new SerializeSignalService();

    const serializedSignals = signals.map(signal =>
      serializeSignal.execute({ originalSignal: signal }),
    );

    return response
      .header('X-Total-Count', String(signalsWithoutPagination.length))
      .json(serializedSignals);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const findSignalById = new FindSignalByIdService();

    const signal = await findSignalById.execute({ signalId: id });

    const serializeSignal = new SerializeSignalService();

    const serializedSignal = serializeSignal.execute({
      originalSignal: signal,
    });

    return response.json(serializedSignal);
  }

  async create(request: Request, response: Response) {
    const items: SignalCreateInput[] = request.body;

    const signals: Signal[] = [];
    const createSignal = new CreateSignalService();

    for (const item of items) {
      const signal = await createSignal.execute({
        currency: item.currency,
        date: item.date,
        operation: item.operation,
        expiration: item.expiration,
      });

      signals.push(signal);
    }

    const serializeSignal = new SerializeSignalService();

    const serializedSignals = signals
      .filter(el => el)
      .map(signal => serializeSignal.execute({ originalSignal: signal }));

    request.io.to('signals').emit('new', serializedSignals);

    return response.json(serializedSignals);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      currency,
      date,
      operation,
      expiration,
      result,
      gales,
    } = request.body;

    const updateSignal = new UpdateSignalService();

    const signal = await updateSignal.execute({
      signalId: id,
      data: { currency, date, operation, expiration, result, gales },
    });

    const serializeSignal = new SerializeSignalService();

    const serializedSignal = serializeSignal.execute({
      originalSignal: signal,
    });

    request.io.to('signals').emit('update', serializedSignal);

    return response.json(serializedSignal);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const deleteSignal = new DeleteSignalService();

    const deletedSignal = await deleteSignal.execute({ signalId: id });

    const serializeSignal = new SerializeSignalService();

    const serializedSignal = serializeSignal.execute({
      originalSignal: deletedSignal,
    });

    return response.json(serializedSignal);
  }
}

export default new SignalController();
