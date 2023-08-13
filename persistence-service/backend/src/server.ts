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

const USE_MOCK = true;  // Set this to false to use the actual TypeOrmService

async function startServer() {
    const app = express();
    
    // Middleware to parse JSON request bodies
    app.use(express.json());

    const dataSource = await postgresDataSource.initialize();
    const typeOrmPersistence = new TypeOrmService(dataSource);
    const mockedTypeOrmPersistence = new MockPersistenceService();
    
    const persistence = USE_MOCK ? mockedTypeOrmPersistence : typeOrmPersistence;

    new TruckApi(persistence, app);
    new EmployeeApi(persistence, app);
    new DriverApi(persistence, app);
    new MechanicApi(persistence, app);
    new BreakdownApi(persistence, app);
    new CustomerApi(persistence, app);
    new ShipmentApi(persistence, app);
    new TripApi(persistence, app);
    new TripDriverApi(persistence, app);
    new TripShipmentApi(persistence, app);
    
    app.get("/", (req, res) => {
        return res.send("Road Freight Transportation company");
    });
    
    app.listen(8000, () => console.log('express server started'));
}

startServer().catch(err => console.error(err));
