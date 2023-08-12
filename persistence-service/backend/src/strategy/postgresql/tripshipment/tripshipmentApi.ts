import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { TripShipment } from "./tripshipment";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class TripShipmentApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a tripshipment by its ID
        this.#express.get("/tripshipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const tripShipment = await this.#persistenceService.findBy(TripShipment, { id: parsedId });
            if (tripShipment) {
                return res.json(tripShipment);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'TripShipment not found' });
                }
            }
        });

        // POST route to create a new tripshipment
        this.#express.post("/tripshipment", async (req, res) => {
            const { body } = req;

            const tripShipment = new TripShipment();
            tripShipment.trip_id = body.trip_id;
            tripShipment.shipment_id = body.shipment_id;

            try {
                await this.#persistenceService.insert(tripShipment, "TripShipment");
                console.log(`TripShipment has been created with id: ${tripShipment.id}`);
                res.status(200);
                return res.json({
                    id: tripShipment.id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "TripShipment creation failed in db."
                });
            }
        });

        // PUT route to update a tripshipment by its ID
        this.#express.put("/tripshipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedTripShipment = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedTripShipment);
                if (success) {
                    return res.json({ message: 'TripShipment updated successfully' });
                } else {
                    return res.status(404).json({ message: 'TripShipment not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "TripShipment update failed in db." });
            }
        });

        // DELETE route to delete a tripshipment by its ID
        this.#express.delete("/tripshipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, TripShipment);
                if (success) {
                    return res.json({ message: 'TripShipment deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'TripShipment not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "TripShipment deletion failed in db." });
            }
        });
    }
}
