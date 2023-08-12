import express from 'express';
import MockPersistenceService from './persistenceService/typeOrmPersistence/mockTypeOrmService';
import TypeOrmService from './persistenceService/typeOrmPersistence/typeOrmPersistence';
import { postgresDataSource } from './strategy/postgresql/configure';
import TruckApi from './strategy/postgresql/truck';
import EmployeeApi from './strategy/postgresql/employee';
import DriverApi from './strategy/postgresql/driver';
import MechanicApi from './strategy/postgresql/mechanic';
import BreakdownApi from './strategy/postgresql/breakdown';
import CustomerApi from './strategy/postgresql/customer';
import ShipmentApi from './strategy/postgresql/shipment';
import TripApi from './strategy/postgresql/trip';

async function startServer() {
    const app = express();
    
    // Add the middleware to parse JSON request bodies
    app.use(express.json());

    const dataSource = await postgresDataSource.initialize();
    const typeOrmPersistence = new TypeOrmService(dataSource);
    const mockedTypeOrmPersistence = new MockPersistenceService();
    
    new TruckApi(mockedTypeOrmPersistence, app);
    new EmployeeApi(mockedTypeOrmPersistence, app);
    new DriverApi(mockedTypeOrmPersistence, app);
    new MechanicApi(mockedTypeOrmPersistence, app);
    new BreakdownApi(mockedTypeOrmPersistence, app);
    new CustomerApi(mockedTypeOrmPersistence, app);
    new ShipmentApi(mockedTypeOrmPersistence, app);
    new TripApi(mockedTypeOrmPersistence, app);
    
    app.get("/", (req, res) => {
        return res.send("Road Freight Transportation company");
    });
    
    app.listen(8000, () => console.log('express server started'));
}

startServer().catch(err => console.error(err));
