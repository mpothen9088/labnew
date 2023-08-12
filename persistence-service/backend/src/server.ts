import express from 'express';
import MockPersistenceService from './persistenceService/typeOrmPersistence/mockTypeOrmService';
import TypeOrmService from './persistenceService/typeOrmPersistence/typeOrmPersistence';
import { postgresDataSource } from './strategy/postgresql/configure';
import TruckApi from './strategy/postgresql/truck';

async function startServer() {
    const app = express();
    
    // Add the middleware to parse JSON request bodies
    app.use(express.json());

    const dataSource = await postgresDataSource.initialize();
    const typeOrmPersistence = new TypeOrmService(dataSource);
    const mockedTypeOrmPersistence = new MockPersistenceService();
    
    new TruckApi(mockedTypeOrmPersistence, app);
    
    app.get("/", (req, res) => {
        return res.send("Road Freight Transportation company");
    });
    
    app.listen(8000, () => console.log('express server started'));
}

startServer().catch(err => console.error(err));
