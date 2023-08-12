import express from 'express';
import request from 'supertest';
import CustomerApi from './customerApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('CustomerApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new CustomerApi(new MockPersistenceService(), app);

    it('should create a new customer and return 200', async () => {
        const customerData = {
            name: 'John Doe',
            address: '123 Main St, City, Country',
            phone_number1: '123-456-7890',
            phone_number2: '098-765-4321'
        };
        const response = await request(app).post('/customer').send(customerData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a customer by its ID', async () => {
        const response = await request(app).get('/customer/1');
        expect(response.status).toBe(200);
    });

    it('should update a customer by its ID and return 200', async () => {
        const updatedData = {
            name: 'Jane Doe',
            address: '456 Another St, City, Country'
        };
        const response = await request(app).put('/customer/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a customer by its ID and return 200', async () => {
        const response = await request(app).delete('/customer/1');
        expect(response.status).toBe(200);
    });
});
