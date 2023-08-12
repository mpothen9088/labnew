import express from 'express';
import request from 'supertest';
import TripDriverApi from './tripdriverApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('TripDriverApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new TripDriverApi(new MockPersistenceService(), app);

    it('should create a new tripdriver entry and return 200', async () => {
        const tripDriverData = {
            trip_id: 1,
            driver_id: 101
        };
        const response = await request(app).post('/tripdriver').send(tripDriverData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a tripdriver entry by its trip ID', async () => {
        const response = await request(app).get('/tripdriver/1');
        expect(response.status).toBe(200);
    });

    it('should update a tripdriver entry by its trip ID and return 200', async () => {
        const updatedData = {
            driver_id: 102
        };
        const response = await request(app).put('/tripdriver/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a tripdriver entry by its trip ID and return 200', async () => {
        const response = await request(app).delete('/tripdriver/1');
        expect(response.status).toBe(200);
    });
});
