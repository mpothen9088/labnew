import express from 'express';
import request from 'supertest';
import EmployeeApi from './employeeApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('EmployeeApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new EmployeeApi(new MockPersistenceService(), app);

    it('should create a new employee and return 200', async () => {
        const employeeData = {
            name: 'Manu Pothen',
            position: 'Driver',
            hire_date: '2022-01-01'
        };
        const response = await request(app).post('/employee').send(employeeData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching an employee by its ID', async () => {
        const response = await request(app).get('/employee/1');
        expect(response.status).toBe(200);
    });

    it('should update an employee by its ID and return 200', async () => {
        const updatedData = {
            position: 'Mechanic'
        };
        const response = await request(app).put('/employee/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete an employee by its ID and return 200', async () => {
        const response = await request(app).delete('/employee/1');
        expect(response.status).toBe(200);
    });
});
