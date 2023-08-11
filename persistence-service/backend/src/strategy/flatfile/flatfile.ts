import PersistenceService from "../../persistenceService";
import fs from "fs";
import path from "path";

export default class FlatfilePersistence implements PersistenceService {
    constructor() {
        if (!fs.existsSync(this.getPath("flatfileDb"))) {
            fs.mkdirSync(this.getPath("flatfileDb"));
        }
    }

    create(name: string): boolean {
        if (fs.existsSync(this.getPath(`flatfileDb`, `${name}.json`))) {
            return false;
        }

        fs.writeFileSync(this.getPath(`flatfileDb`, `${name}.json`), "");
        return true;
    }

    insert<T = unknown>(content: T, location: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                fs.appendFileSync(
                    this.getPath("flatfileDb", `${location}.json`),
                    JSON.stringify(content)
                );
                resolve(true);
            } catch (error) {
                reject(false);
            }
        });
    }

    // Modified the findBy method to return null to satisfy the PersistenceService interface
    async findBy<T = unknown>(_entity: new () => T, _criteria: any): Promise<T | null> {
        throw new Error("findBy method is not implemented for FlatfilePersistence");
        return null;  // Explicitly returning null here for consistency
    }

    private getPath(...dir: string[]) {
        return path.join(__dirname, ...dir);
    }
}
