// PersistenceService.ts

import { ObjectLiteral } from "typeorm";

export default interface PersistenceService {
    create(location: string): boolean;
    insert<T extends ObjectLiteral>(content: T, location: string): Promise<boolean>;
    findBy<T extends ObjectLiteral>(entity: { new(): T }, criteria: any): Promise<T | null>;
}
