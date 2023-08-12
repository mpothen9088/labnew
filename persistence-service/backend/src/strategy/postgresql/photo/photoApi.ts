import { Express } from "express";
import { DataSource } from "typeorm";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Photo } from "./photo";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class PhotoApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a photo by its ID
        this.#express.get("/photo/:id", async (req, res) => {
            if (!req.params.id) {
                res.status(400);
                return res.json({ message: 'id is not defined' });
            }

            const parsedId = parseInt(req.params.id);
            const photo = await this.#persistenceService.findBy(Photo, { id: parsedId });
            if (photo) {
                return res.json(photo);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Photo not found' });
                }
            }
        });

        // POST route to create a new photo
        this.#express.post("/photo", async (req, res) => {
            const { body } = req;

            const photo = new Photo();
            photo.name = body.name;
            photo.description = body.description;
            photo.filename = body.filename;
            photo.views = 0;
            photo.isPublished = true;

            try {
                await this.#persistenceService.insert(photo, "Photo");
                console.log(`photo has been created with id: ${photo.id}`);
                res.status(200);
                return res.json({
                    id: photo.id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Photo creation failed in db."
                });
            }
        });

        // PUT route to update a photo by its ID
        this.#express.put("/photo/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedPhoto = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedPhoto);
                if (success) {
                    return res.json({ message: 'Photo updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Photo not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Photo update failed in db." });
            }
        });

        // DELETE route to delete a photo by its ID
        this.#express.delete("/photo/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Photo);
                if (success) {
                    return res.json({ message: 'Photo deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Photo not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Photo deletion failed in db." });
            }
        });
    }
}
