import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Photo } from "./photo";

export default class PhotoApi {
  #persistenceService: PersistenceService;
  #express: Express;

  constructor(persistenceService: PersistenceService, express: Express) {
    this.#persistenceService = persistenceService;
    this.#express = express;

    this.#express.get("/photo/:id", async (req, res) => {
      try {
        const photo = await this.#persistenceService.findBy(Photo, {
          id: parseInt(req.params.id),
        });
        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }
        return res.json(photo);
      } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
            return res.status(500).json({ error: "Failed to fetch photo", details: err.message });
        }
        return res.status(500).json({ error: "Failed to fetch photo" });
      }
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
        return res.status(200).json({ id: photo.id });
      } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(err);
            return res.status(503).json({ error: "Photo creation failed in db.", details: err.message });
        }
        return res.status(503).json({ error: "Photo creation failed in db." });
      }
    });
  }
}
