import { DataSource } from "typeorm";
import PersistenceService from "../persistenceService";

export default class TypeOrmService implements PersistenceService {
    #dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.#dataSource = dataSource;
    }

    create(location: string): boolean {
        throw new Error('Not Implemented: TypeOrm does not support this operation');
    }

    // Generalized insert method to accept any type of content
    async insert<T = unknown>(content: T, location: string): Promise<boolean> {
        try {
            await this.#dataSource.manager.save(content);
            return true;
        } catch (error) {
            throw new Error(`TypeOrmService: Insert into ${location} failed with ${error}`);
        }
    }

    // Dummy findBy implementation for demonstration purposes
    async findBy<T = unknown>(entity: { new(): T }, criteria: any): Promise<T | null> {
        // Here, you would typically use TypeORM's query methods to find an entity based on criteria.
        // For simplicity, I'm returning null to signify "entity not found."
        return null;
    }
}
