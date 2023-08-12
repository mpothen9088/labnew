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
                const typedItem = item as any;  // Type assertion
                for (let key in criteria) {
                    if (typedItem[key] !== criteria[key]) {
                        return false;
                    }
                }
                return true;
            });
            return found || null;
        } catch (error) {
            const typedError = error as Error;  // Type assertion
            throw new Error(`Error reading from flatfile: ${typedError.message}`);
        }
    }

    async update<T = unknown>(id: number, content: T, location: string): Promise<boolean> {
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
            const index = data.findIndex(item => (item as any).id === id);  // Assuming each item has an 'id' property

            if (index === -1) {
                return false;
            }

            data[index] = { ...data[index], ...content };
            fs.writeFileSync(this.getPath("flatfileDb", `${location}.json`), JSON.stringify(data));
            return true;
        } catch (error) {
            const typedError = error as Error;  // Type assertion
            throw new Error(`Error updating in flatfile: ${typedError.message}`);
        }
    }

    async delete<T = unknown>(id: number, location: string): Promise<boolean> {
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
            const initialLength = data.length;
            const newData = data.filter(item => (item as any).id !== id);  // Assuming each item has an 'id' property

            if (newData.length === initialLength) {
                return false;
            }

            fs.writeFileSync(this.getPath("flatfileDb", `${location}.json`), JSON.stringify(newData));
            return true;
        } catch (error) {
            const typedError = error as Error;  // Type assertion
            throw new Error(`Error deleting from flatfile: ${typedError.message}`);
        }
    }

    private getPath(...dir: string[]) {
        return path.join(__dirname, ...dir);
    }
}
