import express from 'express';
import request from 'supertest';
import BreakdownApi from './breakdownApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('BreakdownApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new BreakdownApi(new MockPersistenceService(), app);

    it('should create a new breakdown and return 200', async () => {
        const breakdownData = {
            truck_id: 1,
            mechanic_id: 1,
            estimated_repair_time: 3
        };
        const response = await request(app).post('/breakdown').send(breakdownData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a breakdown by its ID', async () => {
        const response = await request(app).get('/breakdown/1');
        expect(response.status).toBe(200);
    });

    it('should update a breakdown by its ID and return 200', async () => {
        const updatedData = {
            estimated_repair_time: 4
        };
        const response = await request(app).put('/breakdown/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a breakdown by its ID and return 200', async () => {
        const response = await request(app).delete('/breakdown/1');
        expect(response.status).toBe(200);
    });
});
