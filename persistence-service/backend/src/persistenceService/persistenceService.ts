export default interface PersistenceService {
  create: (name: string) => void;
  insert: <T = unknown>(content: T, location: string) => void;
  findBy: <T = unknown>(entity: new () => T, criteria: any) => Promise<T | undefined>;
  // drop: (name: string) => void;
  // update: <T = unknown>(content: T, location: string) => void;
  // delete: <T = unknown>(content: T, location: string) => void;
}
