import { Express } from "express";
import { DataSource } from "typeorm";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Photo } from "./photo";

export default class PhotoApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        this.#express.get("/photo/:id", async (req, res) => {
            if (!req.params.id) {
                res.status(400);
                return res.json({ message: 'id is not defined' });
            }

            const parsedId = parseInt(req.params.id);
            const photo = await this.#persistenceService.findBy(Photo, { id: parsedId });
            return res.json(photo);
        });

        this.#express.post("/photo", async (req, res) => {
            const { body } = req;
            console.log(body);

            const photo = new Photo();
            photo.name = body.name;
            photo.description = body.description;
            photo.filename = body.filename;
            photo.views = 0;
            photo.isPublished = true;

            try {
                await this.#persistenceService.insert(photo, "Photo");
                console.log(`photo has been created with id: ${photo.id}`);
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Photo creation failed in db."
                });
            }

            res.status(200);
            return res.json({
                id: photo.id,
            });
        });
    }
}
