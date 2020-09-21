import {
  RecoveryPasswordRequestGetPayload,
  RecoveryPasswordRequestCreateInput,
  RecoveryPasswordRequestUpdateInput,
} from '@prisma/client';

import Repository from './Repository';

export type ForgottenPassword = RecoveryPasswordRequestGetPayload<{
  include: {
    user: true;
  };
}>;

class RecoveryPasswordRequestRepository extends Repository<
  ForgottenPassword,
  RecoveryPasswordRequestCreateInput,
  RecoveryPasswordRequestUpdateInput
> {
  readonly include = {
    user: true,
  };

  create(
    data: RecoveryPasswordRequestCreateInput,
  ): Promise<ForgottenPassword | null> {
    return this.prisma.recoveryPasswordRequest.create({
      data,
      include: this.include,
    });
  }

  update(
    id: string,
    data: RecoveryPasswordRequestUpdateInput,
  ): Promise<ForgottenPassword | null> {
    return this.prisma.recoveryPasswordRequest.update({
      where: { id },
      data: {
        ...data,
        updated_at: new Date(),
      },
      include: this.include,
    });
  }

  findByToken(token: string): Promise<ForgottenPassword | null> {
    return this.prisma.recoveryPasswordRequest.findOne({
      where: { token },
      include: this.include,
    });
  }
}

export default new RecoveryPasswordRequestRepository();
