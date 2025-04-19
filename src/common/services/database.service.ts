import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  /**
   * Execute operations in a transaction
   * @param operations Function containing database operations to execute in transaction
   * @returns Result of the transaction
   */
  async executeInTransaction<T>(
    operations: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.entityManager.transaction(operations);
  }
}
