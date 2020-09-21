import {
  PagarMeSubscriptionGetPayload,
  PagarMeSubscriptionCreateInput,
  PagarMeSubscriptionUpdateInput,
} from '@prisma/client';

import Repository from './Repository';

export type PagarMeSubscription = PagarMeSubscriptionGetPayload<{
  include: {
    profile: true;
  };
}>;

class SubscriptionsRepository extends Repository<
  PagarMeSubscription,
  PagarMeSubscriptionCreateInput,
  PagarMeSubscriptionUpdateInput
> {
  readonly include = {
    profile: {
      include: {
        user: true,
      },
    },
  };

  findAll(): Promise<PagarMeSubscription[]> {
    return this.prisma.pagarMeSubscription.findMany({ include: this.include });
  }

  findById(id: string): Promise<PagarMeSubscription | null> {
    return this.prisma.pagarMeSubscription.findOne({
      where: { id },
      include: this.include,
    });
  }

  create(
    data: PagarMeSubscriptionCreateInput,
  ): Promise<PagarMeSubscription | null> {
    return this.prisma.pagarMeSubscription.create({
      data,
      include: this.include,
    });
  }

  update(
    id: string,
    data: PagarMeSubscriptionUpdateInput,
  ): Promise<PagarMeSubscription | null> {
    return this.prisma.pagarMeSubscription.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: this.include,
    });
  }

  delete(id: string): Promise<PagarMeSubscription | null> {
    return this.prisma.pagarMeSubscription.delete({
      where: { id },
      include: this.include,
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.pagarMeSubscription.count({
      where: { id },
    });

    return count > 0;
  }

  async findBySubscriptionId(id: number): Promise<PagarMeSubscription | null> {
    const subscriptions = await this.prisma.pagarMeSubscription.findMany({
      where: { subscription_id: id },
      include: this.include,
    });

    if (subscriptions.length <= 0) return null;

    return subscriptions[0];
  }
}

export default new SubscriptionsRepository();
