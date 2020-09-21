import {
  UserGetPayload,
  UserCreateInput,
  UserUpdateInput,
} from '@prisma/client';

import Repository from './Repository';

export type User = UserGetPayload<{
  include: {
    profile: {
      include: {
        statistics: {
          include: {
            wins: true;
            losses: true;
          };
        };
        subscriptions: true;
        referral: {
          include: {
            profile: true;
          };
        };
      };
    };
    referrals: {
      include: {
        user: true;
      };
    };
  };
}>;

class UserRepository extends Repository<
  User,
  UserCreateInput,
  UserUpdateInput
> {
  readonly include = {
    profile: {
      include: {
        statistics: {
          include: {
            wins: true,
            losses: true,
          },
        },
        subscriptions: true,
        referral: {
          include: {
            profile: true,
          },
        },
      },
    },
    referrals: {
      include: {
        user: true,
      },
    },
  };

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: this.include,
    });
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findOne({ where: { id }, include: this.include });
  }

  create(data: UserCreateInput): Promise<User | null> {
    return this.prisma.user.create({ data, include: this.include });
  }

  update(id: string, data: UserUpdateInput): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: this.include,
    });
  }

  delete(id: string): Promise<User | null> {
    return this.prisma.user.delete({ where: { id }, include: this.include });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.user.count({ where: { id } });

    return count > 0;
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findOne({
      where: { email },
      include: this.include,
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findOne({
      where: { username },
      include: this.include,
    });
  }

  async findByReferralId(referral_id: string): Promise<User | null> {
    const users = await this.prisma.user.findMany({
      where: {
        profile: {
          referral_id,
        },
      },
      include: this.include,
    });

    if (users.length > 0) {
      return users[0];
    }

    return null;
  }
}

export default new UserRepository();
