import express from 'express';
import request from 'supertest';
import DriverApi from './driverApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('DriverApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new DriverApi(new MockPersistenceService(), app);

    it('should create a new driver and return 200', async () => {
        const driverData = {
            employee_id: 1,
            category: 'Heavy Trucks'
        };
        const response = await request(app).post('/driver').send(driverData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a driver by its ID', async () => {
        const response = await request(app).get('/driver/1');
        expect(response.status).toBe(200);
    });

    it('should update a driver by its ID and return 200', async () => {
        const updatedData = {
            category: 'Light Trucks'
        };
        const response = await request(app).put('/driver/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a driver by its ID and return 200', async () => {
        const response = await request(app).delete('/driver/1');
        expect(response.status).toBe(200);
    });
});
