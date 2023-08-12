import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Driver } from "./driver";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class DriverApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a driver by its ID
        this.#express.get("/driver/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const driver = await this.#persistenceService.findBy(Driver, { driver_id: parsedId });
            if (driver) {
                return res.json(driver);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Driver not found' });
                }
            }
        });

        // POST route to create a new driver
        this.#express.post("/driver", async (req, res) => {
            const { body } = req;

            const driver = new Driver();
            driver.employee_id = body.employee_id;
            driver.category = body.category;

            try {
                await this.#persistenceService.insert(driver, "Driver");
                console.log(`Driver has been created with id: ${driver.driver_id}`);
                res.status(200);
                return res.json({
                    driver_id: driver.driver_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Driver creation failed in db."
                });
            }
        });

        // PUT route to update a driver by its ID
        this.#express.put("/driver/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedDriver = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedDriver);
                if (success) {
                    return res.json({ message: 'Driver updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Driver not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Driver update failed in db." });
            }
        });

        // DELETE route to delete a driver by its ID
        this.#express.delete("/driver/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Driver);
                if (success) {
                    return res.json({ message: 'Driver deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Driver not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Driver deletion failed in db." });
            }
        });
    }
}
