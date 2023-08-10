export default interface PersistenceService {
    create: (location: string) => boolean;

    // Option 1: Generalized insert method to accept any type of content
    insert: <T = unknown>(content: T, location: string) => Promise<boolean>;

    // Uncomment the below line for Option 2, which is specific to Photo type
    // insert: (content: Photo, location: string) => Promise<boolean>;

    // Assuming you also want to add the findBy method as discussed earlier:
    findBy: <T = unknown>(entity: { new(): T }, criteria: any) => Promise<T | null>;
}
