import express from 'express';
import request from 'supertest';  // This is used to make requests to our Express app within tests
import PhotoApi from './photoApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('PhotoApi CRUD operations', () => {
    let app: express.Express;
    const mockPersistenceService = new MockPersistenceService();

    beforeAll(() => {
        app = express();
        app.use(express.json());
        new PhotoApi(mockPersistenceService, app);
    });

    it('should create a new photo', async () => {
        const photoData = {
            name: 'Test Photo',
            description: 'This is a test photo',
            filename: 'test.jpg'
        };

        const response = await request(app).post('/photo').send(photoData);
        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
    });

    it('should fetch a photo by its ID', async () => {
        const response = await request(app).get('/photo/1');  // Assuming the mock returns a photo with ID 1
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });

    it('should update a photo by its ID', async () => {
        const updatedData = {
            name: 'Updated Test Photo'
        };

        const response = await request(app).put('/photo/1').send(updatedData);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Photo updated successfully');
    });

    it('should delete a photo by its ID', async () => {
        const response = await request(app).delete('/photo/1');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Photo deleted successfully');
    });
});

