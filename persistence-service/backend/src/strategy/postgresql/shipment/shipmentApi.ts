import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Truck } from "./truck";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class TruckApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a truck by its ID
        this.#express.get("/truck/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const truck = await this.#persistenceService.findBy(Truck, { truck_id: parsedId });
            if (truck) {
                return res.json(truck);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Truck not found' });
                }
            }
        });

        // POST route to create a new truck
        this.#express.post("/truck", async (req, res) => {
            const { body } = req;

            const truck = new Truck();
            truck.brand = body.brand;
            truck.load = body.load;
            truck.capacity = body.capacity;
            truck.year = body.year;
            truck.number_of_repairs = body.number_of_repairs;

            try {
                await this.#persistenceService.insert(truck, "Truck");
                console.log(`Truck has been created with id: ${truck.truck_id}`);
                res.status(200);
                return res.json({
                    truck_id: truck.truck_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Truck creation failed in db."
                });
            }
        });

        // PUT route to update a truck by its ID
        this.#express.put("/truck/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedTruck = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedTruck);
                if (success) {
                    return res.json({ message: 'Truck updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Truck not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Truck update failed in db." });
            }
        });

        // DELETE route to delete a truck by its ID
        this.#express.delete("/truck/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Truck);
                if (success) {
                    return res.json({ message: 'Truck deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Truck not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Truck deletion failed in db." });
            }
        });
    }
}
