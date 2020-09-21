import { hash } from 'bcrypt';

import { Role, UserUpdateOneWithoutReferralsInput } from '@prisma/client';

import AppError from '~/errors/AppError';
import UsersRepository, { User } from '~/repositories/UsersRepository';

import FindUserByIdService from './FindUserByIdService';

interface Request {
  user_id: string;
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  referral_id?: string;
  referral?: string | null;
  roles?: Role[];
}

class UpdateUserService {
  async execute({
    user_id,
    name,
    email,
    username,
    password,
    referral_id,
    referral,
    roles = [],
  }: Request): Promise<User> {
    const findUserById = new FindUserByIdService();

    const user = await findUserById.execute({ user_id });

    const userByEmail = await UsersRepository.findByEmail(email || '');

    if (userByEmail && userByEmail.id !== user.id) {
      throw new AppError('E-mail address already used.', 409);
    }

    const userByUsername = await UsersRepository.findByUsername(username || '');

    if (userByUsername && userByUsername.id !== user.id) {
      throw new AppError('Username already used.', 409);
    }

    const hashedPassword = password && (await hash(password, 10));

    const referralIdUser = await UsersRepository.findByReferralId(
      referral_id || '',
    );

    if (referralIdUser && referralIdUser.id !== user.id) {
      throw new AppError('Referral ID already used.', 409);
    }

    let referralInput: UserUpdateOneWithoutReferralsInput | undefined;

    if (referral === null) {
      referralInput = {
        disconnect: true,
      };
    } else {
      const referralUser = await UsersRepository.findByReferralId(
        referral || '',
      );

      if (referralUser?.id === user_id) {
        throw new AppError('Can not referral own ID.', 409);
      }

      if (referralUser) {
        referralInput = {
          connect: {
            id: referralUser.id,
          },
        };
      }
    }

    const updatedUser = await UsersRepository.update(user_id, {
      name,
      email,
      username,
      password: hashedPassword,
      profile: {
        update: {
          referral_id,
          referral: referralInput,
          roles: {
            set: roles,
          },
        },
      },
    });

    if (!updatedUser) {
      throw new AppError('It was not possible to create a new user.', 500);
    }

    return updatedUser;
  }
}

export default UpdateUserService;
