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

        fs.writeFileSync(this.getPath(`flatfileDb`, `${name}.json`), "[]");
        return true;
    }

    insert<T = unknown>(content: T, location: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const data = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
                data.push(content);
                fs.writeFileSync(this.getPath("flatfileDb", `${location}.json`), JSON.stringify(data));
                resolve(true);
            } catch (error) {
                reject(false);
            }
        });
    }

    async findBy<T = unknown>(_entity: new () => T, criteria: any): Promise<T | null> {
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${_entity.name}.json`), 'utf8'));
            const found = data.find(item => {
                for (let key in criteria) {
                    if (item[key] !== criteria[key]) {
                        return false;
                    }
                }
                return true;
            });
            return found || null;
        } catch (error) {
            throw new Error(`Error reading from flatfile: ${error.message}`);
        }
    }

    private getPath(...dir: string[]) {
        return path.join(__dirname, ...dir);
    }
}
