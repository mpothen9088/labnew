import { Express } from "express";
import { DataSource } from "typeorm";
import PersistenceService from "../../../persistenceService/persistenceService"; // Fixed the quotation marks
import { Photo } from "./photo";

export default class PhotoApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        this.#express.get("/photo/:id", async (req, res) => {
            return res.json(
                await this.#persistenceService.findBy(Photo, { // Removed unnecessary spaces
                    id: parseInt(req.params.id),
                })
            );
        });

        this.#express.post("/photo", async (req, res) => {
            const { body } = req;
            console.log(body);

            const photo = new Photo();
            photo.name = body.name; // Fixed spacing
            photo.description = body.description;
            photo.filename = body.filename;
            photo.views = 0;
            photo.isPublished = true;

            try {
                await this.#persistenceService.insert(photo, "Photo"); // Fixed quotation marks
                console.log(`photo has been created with id: ${photo.id}`); // Fixed template string
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
