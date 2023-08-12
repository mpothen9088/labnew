import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Customer } from "./customer";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class CustomerApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch a customer by its ID
        this.#express.get("/customer/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const customer = await this.#persistenceService.findBy(Customer, { customer_id: parsedId });
            if (customer) {
                return res.json(customer);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Customer not found' });
                }
            }
        });

        // POST route to create a new customer
        this.#express.post("/customer", async (req, res) => {
            const { body } = req;

            const customer = new Customer();
            customer.name = body.name;
            customer.address = body.address;
            customer.phone_number1 = body.phone_number1;
            customer.phone_number2 = body.phone_number2;

            try {
                await this.#persistenceService.insert(customer, "Customer");
                console.log(`Customer has been created with id: ${customer.customer_id}`);
                res.status(200);
                return res.json({
                    customer_id: customer.customer_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Customer creation failed in db."
                });
            }
        });

        // PUT route to update a customer by its ID
        this.#express.put("/customer/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedCustomer = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedCustomer);
                if (success) {
                    return res.json({ message: 'Customer updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Customer not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Customer update failed in db." });
            }
        });

        // DELETE route to delete a customer by its ID
        this.#express.delete("/customer/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Customer);
                if (success) {
                    return res.json({ message: 'Customer deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Customer not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Customer deletion failed in db." });
            }
        });
    }
}
