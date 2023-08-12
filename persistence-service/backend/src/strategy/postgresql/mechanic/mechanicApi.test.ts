import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Mechanic } from "./mechanic";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class MechanicApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a mechanic by its ID
        this.#express.get("/mechanic/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const mechanic = await this.#persistenceService.findBy(Mechanic, { employee_id: parsedId });
            if (mechanic) {
                return res.json(mechanic);
            } else {
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Mechanic not found' });
                }
            }
        });

        // POST route to create a new mechanic
        this.#express.post("/mechanic", async (req, res) => {
            const { body } = req;

            const mechanic = new Mechanic();
            mechanic.specialized_brand = body.specialized_brand;

            try {
                await this.#persistenceService.insert(mechanic, "Mechanic");
                console.log(`Mechanic has been created with id: ${mechanic.employee_id}`);
                res.status(200);
                return res.json({
                    employee_id: mechanic.employee_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Mechanic creation failed in db."
                });
            }
        });

        // PUT route to update a mechanic by its ID
        this.#express.put("/mechanic/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedMechanic = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedMechanic);
                if (success) {
                    return res.json({ message: 'Mechanic updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Mechanic not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Mechanic update failed in db." });
            }
        });

        // DELETE route to delete a mechanic by its ID
        this.#express.delete("/mechanic/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Mechanic);
                if (success) {
                    return res.json({ message: 'Mechanic deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Mechanic not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Mechanic deletion failed in db." });
            }
        });
    }
}
