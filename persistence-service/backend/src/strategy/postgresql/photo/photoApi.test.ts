import express from 'express';
import request from 'supertest';
import PhotoApi from './photoApi';
import MockPersistenceService from '../../../persistenceService/typeOrmPersistence/mockTypeOrmService';

describe('PhotoApi CRUD operations', () => {
    const app = express();
    app.use(express.json());
    new PhotoApi(new MockPersistenceService(), app);

    it('should create a new photo and return 200', async () => {
        const photoData = {
            name: 'Test Photo',
            description: 'This is a test photo',
            filename: 'test.jpg'
        };
        const response = await request(app).post('/photo').send(photoData);
        expect(response.status).toBe(200);
    });

    it('should return 200 when fetching a photo by its ID', async () => {
        const response = await request(app).get('/photo/1');
        expect(response.status).toBe(200);
    });

    it('should update a photo by its ID and return 200', async () => {
        const updatedData = {
            name: 'Updated Test Photo'
        };
        const response = await request(app).put('/photo/1').send(updatedData);
        expect(response.status).toBe(200);
    });

    it('should delete a photo by its ID and return 200', async () => {
        const response = await request(app).delete('/photo/1');
        expect(response.status).toBe(200);
    });
});
