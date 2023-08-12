import { ObjectLiteral } from "typeorm";

export default interface PersistenceService {
    create(location: string): boolean;
    insert<T extends ObjectLiteral>(content: T, location: string): Promise<boolean>;
    findBy<T extends ObjectLiteral>(entity: { new(): T }, criteria: any): Promise<T | null>;
    update<T extends ObjectLiteral>(id: number, content: T): Promise<boolean>;
    delete<T extends ObjectLiteral>(id: number, entity: { new(): T }): Promise<boolean>;
}
