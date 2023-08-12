import PersistenceService from "../persistenceService";

export default class MockPersistenceService implements PersistenceService {
  
  create(location: string): boolean {
    throw new Error('Not Implemented');
  }

  async insert<T = unknown>(content: T, location: string): Promise<boolean> {
    // Mock implementation for insert
    console.log(`Mock: Inserted into ${location}`);
    return true;
  }

  async findBy<T = unknown>(entity: new () => T, criteria: any): Promise<T | null> {
    // Mock implementation for findBy
    console.log(`Mock: Find by criteria in ${entity.name}`);

    // Return a mock photo object if the entity name is 'Photo'
    if (entity.name === 'Photo') {
        return {
            id: criteria.id,
            name: 'Mock Photo',
            description: 'This is a mock photo description',
            filename: 'mockphoto.jpg',
            views: 0,
            isPublished: true
        } as any;
    }

    return null;
  }

  async update<T = unknown>(id: number, content: T): Promise<boolean> {
    // Mock implementation for update
    console.log(`Mock: Updated record with ID ${id}`);
    return true;
  }

  async delete<T = unknown>(id: number, entity: new () => T): Promise<boolean> {
    // Mock implementation for delete
    console.log(`Mock: Deleted record with ID ${id} from ${entity.name}`);
    return true;
  }
}
