import express from 'express';
import request from 'supertest';
import TruckApi from './truckApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('TruckApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new TruckApi(new MockPersistenceService(), app);

    it('should create a new truck and return 200', async () => {
        const truckData = {
            brand: 'Test Truck Brand',
            load: 500,
            capacity: 1500,
            year: 2022,
            number_of_repairs: 2
        };
        const response = await request(app).post('/truck').send(truckData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a truck by its ID', async () => {
        const response = await request(app).get('/truck/1');
        expect(response.status).toBe(200);
    });

    it('should update a truck by its ID and return 200', async () => {
        const updatedData = {
            brand: 'Updated Truck Brand',
            load: 600
        };
        const response = await request(app).put('/truck/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a truck by its ID and return 200', async () => {
        const response = await request(app).delete('/truck/1');
        expect(response.status).toBe(200);
    });
});
