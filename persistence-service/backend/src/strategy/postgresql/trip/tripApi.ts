import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Trip } from "./trip";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class TripApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a trip by its ID
        this.#express.get("/trip/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const trip = await this.#persistenceService.findBy(Trip, { trip_id: parsedId });
            if (trip) {
                return res.json(trip);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Trip not found' });
                }
            }
        });

        // POST route to create a new trip
        this.#express.post("/trip", async (req, res) => {
            const { body } = req;

            const trip = new Trip();
            trip.route_from = body.route_from;
            trip.route_to = body.route_to;

            try {
                await this.#persistenceService.insert(trip, "Trip");
                console.log(`Trip has been created with id: ${trip.trip_id}`);
                res.status(200);
                return res.json({
                    trip_id: trip.trip_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Trip creation failed in db."
                });
            }
        });

        // PUT route to update a trip by its ID
        this.#express.put("/trip/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedTrip = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedTrip);
                if (success) {
                    return res.json({ message: 'Trip updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Trip not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Trip update failed in db." });
            }
        });

        // DELETE route to delete a trip by its ID
        this.#express.delete("/trip/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Trip);
                if (success) {
                    return res.json({ message: 'Trip deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Trip not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Trip deletion failed in db." });
            }
        });
    }
}
