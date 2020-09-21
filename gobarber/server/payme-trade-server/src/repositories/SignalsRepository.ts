import {
  SignalGetPayload,
  SignalCreateInput,
  SignalUpdateInput,
} from '@prisma/client';

import Repository from './Repository';

interface Pagination {
  page?: number;
  rowsPerPage?: number;
}

export type Signal = SignalGetPayload<{
  include: {
    won_by: {
      select: {
        id: true;
      };
    };
    lost_by: {
      select: {
        id: true;
      };
    };
  };
}>;

class SignalsRepository extends Repository<
  Signal,
  SignalCreateInput,
  SignalUpdateInput
> {
  readonly include = {
    won_by: {
      select: {
        id: true,
      },
    },
    lost_by: {
      select: {
        id: true,
      },
    },
  };

  findAll(): Promise<Signal[]> {
    return this.prisma.signal.findMany({
      include: this.include,
      orderBy: { date: 'desc' },
    });
  }

  findById(id: string): Promise<Signal | null> {
    return this.prisma.signal.findOne({ where: { id }, include: this.include });
  }

  create(data: SignalCreateInput): Promise<Signal | null> {
    return this.prisma.signal.create({ data, include: this.include });
  }

  update(id: string, data: SignalUpdateInput): Promise<Signal | null> {
    return this.prisma.signal.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: this.include,
    });
  }

  delete(id: string): Promise<Signal | null> {
    return this.prisma.signal.delete({ where: { id }, include: this.include });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.signal.count({ where: { id } });

    return count > 0;
  }

  async findAllOfToday({ page = 0, rowsPerPage = 0 }: Pagination = {}): Promise<
    Signal[]
  > {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const signals = await this.prisma.signal.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: this.include,
      orderBy: {
        date: 'desc',
      },
      skip: page && rowsPerPage ? (page - 1) * rowsPerPage : 0,
      take: rowsPerPage || undefined,
    });

    return signals;
  }
}

export default new SignalsRepository();
