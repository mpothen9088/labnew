// typeOrmPersistence.ts

import { DataSource, ObjectLiteral } from "typeorm";
import PersistenceService from "../persistenceService";

export default class TypeOrmService implements PersistenceService {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    create(location: string): boolean {
        throw new Error('Not Implemented: TypeOrm does not support this operation');
    }

    async insert<T extends ObjectLiteral>(content: T, location: string): Promise<boolean> {
        try {
            await this.#dataSource.manager.save(content);
            return true;
        } catch (error) {
            throw new Error(`TypeOrmService: Insert into ${location} failed with ${error}`);
        }
    }

    async findBy<T extends ObjectLiteral>(entity: { new(): T }, criteria: any): Promise<T | null> {
        try {
            const repository = this.#dataSource.getRepository(entity);
            const result = await repository.findOne(criteria);
            return result || null;
        } catch (error) {
            throw new Error(`TypeOrmService: Error fetching data with criteria ${JSON.stringify(criteria)}: ${error}`);
        }
    }
}
