import { DataSource } from "typeorm";
import PersistenceService from "../persistenceService";

export default class TypeOrmService implements PersistenceService {
  #dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.#dataSource = dataSource;
  }

  create(name: string): void {
    throw new Error('Not Implemented: TypeOrm does not support this operation');
  }

  async insert<T = unknown>(content: T, location: string): Promise<void> {
    try {
      await this.#dataSource.manager.save(content);
    } catch (error) {
      throw new Error(`TypeOrmService: Insert into ${location} failed with ${error}`);
    }
  }

  async findBy<T = unknown>(entity: new () => T, criteria: any): Promise<T | undefined> {
    const result = await this.#dataSource.manager.findOne(entity, criteria);
    return result as T | undefined;  // Fixed line with type assertion
  }
}
