import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { TripDriver } from "./tripdriver";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class TripDriverApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a tripdriver by its trip ID
        this.#express.get("/tripdriver/:trip_id", async (req, res) => {
            const parsedId = parseInt(req.params.trip_id);
            const tripDriver = await this.#persistenceService.findBy(TripDriver, { trip_id: parsedId });
            if (tripDriver) {
                return res.json(tripDriver);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'TripDriver not found' });
                }
            }
        });

        // POST route to create a new tripdriver
        this.#express.post("/tripdriver", async (req, res) => {
            const { body } = req;

            const tripDriver = new TripDriver();
            tripDriver.trip_id = body.trip_id;
            tripDriver.driver_id = body.driver_id;

            try {
                await this.#persistenceService.insert(tripDriver, "TripDriver");
                console.log(`TripDriver has been created with trip_id: ${tripDriver.trip_id}`);
                res.status(200);
                return res.json({
                    trip_id: tripDriver.trip_id,
                    driver_id: tripDriver.driver_id
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "TripDriver creation failed in db."
                });
            }
        });

        // PUT route to update a tripdriver by its trip ID
        this.#express.put("/tripdriver/:trip_id", async (req, res) => {
            const parsedId = parseInt(req.params.trip_id);
            const updatedTripDriver = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedTripDriver);
                if (success) {
                    return res.json({ message: 'TripDriver updated successfully' });
                } else {
                    return res.status(404).json({ message: 'TripDriver not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "TripDriver update failed in db." });
            }
        });

        // DELETE route to delete a tripdriver by its trip ID
        this.#express.delete("/tripdriver/:trip_id", async (req, res) => {
            const parsedId = parseInt(req.params.trip_id);

            try {
                const success = await this.#persistenceService.delete(parsedId, TripDriver);
                if (success) {
                    return res.json({ message: 'TripDriver deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'TripDriver not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "TripDriver deletion failed in db." });
            }
        });
    }
}
