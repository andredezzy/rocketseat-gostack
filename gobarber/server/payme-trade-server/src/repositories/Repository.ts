/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';

abstract class BaseRepository<T, TCreateInput, TUpdateInput> {
  readonly prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  findAll(): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  findById(_id: string): Promise<T | null> {
    throw new Error('Method not implemented.');
  }

  create(_data: TCreateInput): Promise<T | null> {
    throw new Error('Method not implemented.');
  }

  update(_id: string, _data: TUpdateInput): Promise<T | null> {
    throw new Error('Method not implemented.');
  }

  delete(_id: string): Promise<T | null> {
    throw new Error('Method not implemented.');
  }

  existsById(_id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}

export default BaseRepository;
