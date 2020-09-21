import { Request, Response } from 'express';

import { Role } from '@prisma/client';

import UsersRepository from '~/repositories/UsersRepository';
import CreateUserService from '~/services/CreateUserService';
import FindUserByIdService from '~/services/FindUserByIdService';
import UpdateUserService from '~/services/UpdateUserService';

class UserController {
  async index(_request: Request, response: Response) {
    const users = await UsersRepository.findAll();

    return response.json(users);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const findUserById = new FindUserByIdService();

    const user = await findUserById.execute({ user_id: id });

    return response.json(user);
  }

  async create(request: Request, response: Response) {
    const { name, email, username, password, referral, roles } = request.body;
    const adminSecretToken = request.headers['x-admin-secret-token'];

    const defaultRoles: Role[] = [];

    if (adminSecretToken === String(process.env.ADMIN_SECRET_TOKEN)) {
      defaultRoles.push(...(roles as Role[]));
    }

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      username,
      password,
      referral,
      roles: defaultRoles,
    });

    return response.json(user);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const {
      name,
      email,
      username,
      password,
      referral_id,
      referral,
      roles,
    } = request.body;
    const adminSecretToken = request.headers['x-admin-secret-token'];

    const newRoles: Role[] = [];

    if (adminSecretToken === String(process.env.ADMIN_SECRET_TOKEN)) {
      newRoles.push(...(roles as Role[]));
    }

    const updateUser = new UpdateUserService();

    const updatedUser = await updateUser.execute({
      user_id: id,
      name,
      email,
      username,
      password,
      referral_id,
      referral: adminSecretToken && referral,
      roles: newRoles,
    });

    return response.json(updatedUser);
  }
}

export default new UserController();
