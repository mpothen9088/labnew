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
import TripDriverApi from './strategy/postgresql/tripdriver';
import TripShipmentApi from './strategy/postgresql/tripshipment';

async function startServer() {
    const app = express();
    
    // Add the middleware to parse JSON request bodies
    app.use(express.json());

    const dataSource = await postgresDataSource.initialize();
    const typeOrmPersistence = new TypeOrmService(dataSource);
    const mockedTypeOrmPersistence = new MockPersistenceService();
    
    new TruckApi(typeOrmPersistence, app);
    new EmployeeApi(typeOrmPersistence, app);
    new DriverApi(typeOrmPersistence, app);
    new MechanicApi(typeOrmPersistence, app);
    new BreakdownApi(typeOrmPersistence, app);
    new CustomerApi(typeOrmPersistence, app);
    new ShipmentApi(typeOrmPersistence, app);
    new TripApi(typeOrmPersistence, app);
    new TripDriverApi(typeOrmPersistence, app);
    new TripShipmentApi(typeOrmPersistence, app);
    
    app.get("/", (req, res) => {
        return res.send("Road Freight Transportation company");
    });
    
    app.listen(8000, () => console.log('express server started'));
}

startServer().catch(err => console.error(err));
