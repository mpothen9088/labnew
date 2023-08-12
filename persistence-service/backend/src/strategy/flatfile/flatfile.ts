import PersistenceService from "../../persistenceService";
import fs from "fs";
import path from "path";
import { ObjectLiteral } from "typeorm";

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

    insert<T extends ObjectLiteral>(content: T): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const location = content.constructor.name;
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

    async findBy<T extends ObjectLiteral>(entity: { new(): T }, criteria: any): Promise<T | null> {
        const location = entity.name;
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
            const found = data.find(item => {
                const typedItem = item as any;
                for (let key in criteria) {
                    if (typedItem[key] !== criteria[key]) {
                        return false;
                    }
                }
                return true;
            });
            return found || null;
        } catch (error) {
            const typedError = error as Error;
            throw new Error(`Error reading from flatfile: ${typedError.message}`);
        }
    }

    async update<T extends ObjectLiteral>(id: number, content: T): Promise<boolean> {
        const location = content.constructor.name;
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
            const index = data.findIndex(item => (item as any).id === id);

            if (index === -1) {
                return false;
            }

            data[index] = { ...data[index], ...content };
            fs.writeFileSync(this.getPath("flatfileDb", `${location}.json`), JSON.stringify(data));
            return true;
        } catch (error) {
            const typedError = error as Error;
            throw new Error(`Error updating in flatfile: ${typedError.message}`);
        }
    }

    async delete<T extends ObjectLiteral>(id: number, entity: { new(): T }): Promise<boolean> {
        const location = entity.name;
        try {
            const data: T[] = JSON.parse(fs.readFileSync(this.getPath("flatfileDb", `${location}.json`), 'utf8'));
            const initialLength = data.length;
            const newData = data.filter(item => (item as any).id !== id);

            if (newData.length === initialLength) {
                return false;
            }

            fs.writeFileSync(this.getPath("flatfileDb", `${location}.json`), JSON.stringify(newData));
            return true;
        } catch (error) {
            const typedError = error as Error;
            throw new Error(`Error deleting from flatfile: ${typedError.message}`);
        }
    }

    private getPath(...dir: string[]) {
        return path.join(__dirname, ...dir);
    }
}
