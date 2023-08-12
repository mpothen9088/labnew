import express from 'express';
import request from 'supertest';
import TripApi from './tripApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('TripApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new TripApi(new MockPersistenceService(), app);

    it('should create a new trip and return 200', async () => {
        const tripData = {
            route_from: 'New York',
            route_to: 'Los Angeles'
        };
        const response = await request(app).post('/trip').send(tripData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a trip by its ID', async () => {
        const response = await request(app).get('/trip/1');
        expect(response.status).toBe(200);
    });

    it('should update a trip by its ID and return 200', async () => {
        const updatedData = {
            route_from: 'San Francisco',
            route_to: 'Chicago'
        };
        const response = await request(app).put('/trip/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a trip by its ID and return 200', async () => {
        const response = await request(app).delete('/trip/1');
        expect(response.status).toBe(200);
    });
});
