import request from 'supertest';

const baseURL = 'http://localhost:80';

describe('Integration tests for /truck API', () => {
    let createdTruckId: number;

    it('should create a new truck and return 200', async () => {
        const truckData = {
            brand: 'Test Truck Brand',
            load: 500,
            capacity: 1500,
            year: 2022,
            number_of_repairs: 2
        };
        const response = await request(baseURL).post('/truck').send(truckData);
        expect(response.status).toBe(200);
        expect(response.body.truck_id).toBeDefined();
        createdTruckId = response.body.truck_id;
    });

    it('should fetch the created truck by its ID and return 200', async () => {
        const response = await request(baseURL).get(`/truck/${createdTruckId}`);
        expect(response.status).toBe(200);
        expect(response.body.brand).toBe('Test Truck Brand');
    });

    it('should update the created truck by its ID and return 200', async () => {
        const updatedData = {
            brand: 'Updated Truck Brand'
        };
        const response = await request(baseURL).put(`/truck/${createdTruckId}`).send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete the truck by its ID and return 200', async () => {
        const response = await request(baseURL).delete(`/truck/${createdTruckId}`);
        expect(response.status).toBe(200);
    });
});
