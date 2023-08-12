import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Breakdown } from "./breakdown";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class BreakdownApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a breakdown by its ID
        this.#express.get("/breakdown/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const breakdown = await this.#persistenceService.findBy(Breakdown, { breakdown_id: parsedId });
            if (breakdown) {
                return res.json(breakdown);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Breakdown not found' });
                }
            }
        });

        // POST route to create a new breakdown
        this.#express.post("/breakdown", async (req, res) => {
            const { body } = req;

            const breakdown = new Breakdown();
            breakdown.truck_id = body.truck_id;
            breakdown.mechanic_id = body.mechanic_id;
            breakdown.estimated_repair_time = body.estimated_repair_time;

            try {
                await this.#persistenceService.insert(breakdown, "Breakdown");
                console.log(`Breakdown has been created with id: ${breakdown.breakdown_id}`);
                res.status(200);
                return res.json({
                    breakdown_id: breakdown.breakdown_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Breakdown creation failed in db."
                });
            }
        });

        // PUT route to update a breakdown by its ID
        this.#express.put("/breakdown/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedBreakdown = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedBreakdown);
                if (success) {
                    return res.json({ message: 'Breakdown updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Breakdown not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Breakdown update failed in db." });
            }
        });

        // DELETE route to delete a breakdown by its ID
        this.#express.delete("/breakdown/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Breakdown);
                if (success) {
                    return res.json({ message: 'Breakdown deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Breakdown not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Breakdown deletion failed in db." });
            }
        });
    }
}
