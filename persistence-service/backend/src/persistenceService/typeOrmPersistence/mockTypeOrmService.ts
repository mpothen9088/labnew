import PersistenceService from "../persistenceService";

export default class MockPersistenceService implements PersistenceService {
  
  create(location: string): boolean {
    throw new Error('Not Implemented');
  }

  async insert<T = unknown>(content: T, location: string): Promise<boolean> {
    // Mock implementation for insert
    return true;
  }

  async findBy<T = unknown>(entity: new () => T, criteria: any): Promise<T | null> {
    // Mock implementation for findBy
    return null;
  }
}
