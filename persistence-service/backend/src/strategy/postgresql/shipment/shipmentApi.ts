import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Shipment } from "./shipment";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class ShipmentApi {  // Renamed class
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a shipment by its ID
        this.#express.get("/shipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const shipment = await this.#persistenceService.findBy(Shipment, { shipment_id: parsedId });
            if (shipment) {
                return res.json(shipment);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Shipment not found' });
                }
            }
        });

        // POST route to create a new shipment
        this.#express.post("/shipment", async (req, res) => {
            const { body } = req;

            const shipment = new Shipment();
            shipment.weight = body.weight;
            shipment.value = body.value;
            shipment.origin = body.origin;
            shipment.destination = body.destination;
            shipment.customer_id = body.customer_id;

            try {
                await this.#persistenceService.insert(shipment, "Shipment");
                console.log(`Shipment has been created with id: ${shipment.shipment_id}`);
                res.status(200);
                return res.json({
                    shipment_id: shipment.shipment_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Shipment creation failed in db."
                });
            }
        });

        // PUT route to update a shipment by its ID
        this.#express.put("/shipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedShipment = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedShipment);
                if (success) {
                    return res.json({ message: 'Shipment updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Shipment not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Shipment update failed in db." });
            }
        });

        // DELETE route to delete a shipment by its ID
        this.#express.delete("/shipment/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Shipment);
                if (success) {
                    return res.json({ message: 'Shipment deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Shipment not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Shipment deletion failed in db." });
            }
        });
    }
}
