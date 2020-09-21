import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: new Date(2020, 7, 10, 13),
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider-id');
    expect(appointment.user_id).toBe('user-id');
  });

  it('should not be able to create two appointment at the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    const appointmentDate = new Date(2020, 7, 10, 13);

    await createAppointment.execute({
      provider_id: 'provider-id',
      user_id: 'user-id',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 7, 10, 11),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'user-id',
        user_id: 'user-id',
        date: new Date(2020, 7, 10, 13),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 7, 11, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        provider_id: 'provider-id',
        user_id: 'user-id',
        date: new Date(2020, 7, 11, 18),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
