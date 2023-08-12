import express from 'express';
import request from 'supertest';
import ShipmentApi from './shipmentApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('ShipmentApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new ShipmentApi(new MockPersistenceService(), app);

    it('should create a new shipment and return 200', async () => {
        const shipmentData = {
            weight: 1000,
            value: 15000,
            origin: 'New York',
            destination: 'Los Angeles',
            customer_id: 1
        };
        const response = await request(app).post('/shipment').send(shipmentData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a shipment by its ID', async () => {
        const response = await request(app).get('/shipment/1');
        expect(response.status).toBe(200);
    });

    it('should update a shipment by its ID and return 200', async () => {
        const updatedData = {
            weight: 1100
        };
        const response = await request(app).put('/shipment/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a shipment by its ID and return 200', async () => {
        const response = await request(app).delete('/shipment/1');
        expect(response.status).toBe(200);
    });
});
