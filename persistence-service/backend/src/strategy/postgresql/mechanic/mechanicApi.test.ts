import express from 'express';
import request from 'supertest';
import MechanicApi from './mechanicApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('MechanicApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new MechanicApi(new MockPersistenceService(), app);

    it('should create a new mechanic and return 200', async () => {
        const mechanicData = {
            employee_id: 1,
            specialized_brand: 'BrandX'
        };
        const response = await request(app).post('/mechanic').send(mechanicData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a mechanic by its ID', async () => {
        const response = await request(app).get('/mechanic/1');
        expect(response.status).toBe(200);
    });

    it('should update a mechanic by its ID and return 200', async () => {
        const updatedData = {
            specialized_brand: 'BrandY'
        };
        const response = await request(app).put('/mechanic/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a mechanic by its ID and return 200', async () => {
        const response = await request(app).delete('/mechanic/1');
        expect(response.status).toBe(200);
    });
});
