import express from 'express';
import request from 'supertest';
import TripShipmentApi from './tripshipmentApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('TripShipmentApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new TripShipmentApi(new MockPersistenceService(), app);

    it('should create a new tripshipment and return 200', async () => {
        const tripShipmentData = {
            trip_id: 1,
            shipment_id: 1001
        };
        const response = await request(app).post('/tripshipment').send(tripShipmentData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a tripshipment by its ID', async () => {
        const response = await request(app).get('/tripshipment/1');
        expect(response.status).toBe(200);
    });

    it('should update a tripshipment by its ID and return 200', async () => {
        const updatedData = {
            trip_id: 2,
            shipment_id: 1002
        };
        const response = await request(app).put('/tripshipment/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a tripshipment by its ID and return 200', async () => {
        const response = await request(app).delete('/tripshipment/1');
        expect(response.status).toBe(200);
    });
});
