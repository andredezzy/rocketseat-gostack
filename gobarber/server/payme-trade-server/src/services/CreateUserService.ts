import { hash } from 'bcrypt';

import { Role, UserUpdateOneWithoutReferralsInput } from '@prisma/client';

import AppError from '~/errors/AppError';
import UsersRepository, { User } from '~/repositories/UsersRepository';
import generateRandomString from '~/utils/generateRandomString';

interface Request {
  name: string;
  email: string;
  username: string;
  password: string;
  referral?: string;
  roles?: Role[];
}

class CreateUserService {
  async execute({
    name,
    email,
    username,
    password,
    referral,
    roles = [],
  }: Request): Promise<User> {
    const userByEmail = await UsersRepository.findByEmail(email);

    if (userByEmail) {
      throw new AppError('E-mail address already used.', 409);
    }

    const userByUsername = await UsersRepository.findByUsername(username);

    if (userByUsername) {
      throw new AppError('Username already used.', 409);
    }

    const hashedPassword = await hash(password, 10);

    let referral_id = generateRandomString(10);

    while (await UsersRepository.findByReferralId(referral_id)) {
      referral_id = generateRandomString(10);
    }

    let referralInput: UserUpdateOneWithoutReferralsInput | undefined;

    if (referral) {
      const referralUser = await UsersRepository.findByReferralId(
        referral || '',
      );

      if (referralUser?.username === username) {
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

    const user = await UsersRepository.create({
      name,
      email,
      username,
      password: hashedPassword,
      profile: {
        create: {
          referral_id,
          referral: referralInput,
          roles: {
            set: roles,
          },
          statistics: { create: {} },
        },
      },
    });

    if (!user) {
      throw new AppError('It was not possible to create a new user.', 500);
    }

    return user;
  }
}

export default CreateUserService;
