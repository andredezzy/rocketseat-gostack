import AppError from '~/errors/AppError';
import UsersRepository, { User } from '~/repositories/UsersRepository';

interface Request {
  user_id: string;
}

class FindSignalByIdService {
  async execute({ user_id }: Request): Promise<User> {
    const user = await UsersRepository.findById(user_id);

    if (!user) {
      throw new AppError('No user found with this ID.', 404);
    }

    return user;
  }
}

export default FindSignalByIdService;
