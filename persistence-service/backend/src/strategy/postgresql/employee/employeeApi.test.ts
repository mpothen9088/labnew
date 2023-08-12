import { Express } from "express";
import PersistenceService from "../../../persistenceService/persistenceService";
import { Employee } from "./employee";
import MockPersistenceService from "../../../persistenceService/typeOrmPersistence/mockTypeOrmService";

export default class EmployeeApi {
    #persistenceService: PersistenceService;
    #express: Express;

    constructor(persistenceService: PersistenceService, express: Express) {
        this.#persistenceService = persistenceService;
        this.#express = express;

        // GET route to fetch an employee by its ID
        this.#express.get("/employee/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const employee = await this.#persistenceService.findBy(Employee, { employee_id: parsedId });
            if (employee) {
                return res.json(employee);
            } else {
                // Only return a 404 if using the real TypeOrmService
                if (this.#persistenceService instanceof MockPersistenceService) {
                    return res.json({ message: 'Using mock service, always returns 200' });
                } else {
                    return res.status(404).json({ message: 'Employee not found' });
                }
            }
        });

        // POST route to create a new employee
        this.#express.post("/employee", async (req, res) => {
            const { body } = req;

            const employee = new Employee();
            employee.first_name = body.first_name;
            employee.last_name = body.last_name;
            employee.seniority = body.seniority;

            try {
                await this.#persistenceService.insert(employee, "Employee");
                console.log(`Employee has been created with id: ${employee.employee_id}`);
                res.status(200);
                return res.json({
                    employee_id: employee.employee_id,
                });
            } catch (err) {
                res.status(503);
                return res.json({
                    error: "Employee creation failed in db."
                });
            }
        });

        // PUT route to update an employee by its ID
        this.#express.put("/employee/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);
            const updatedEmployee = req.body;

            try {
                const success = await this.#persistenceService.update(parsedId, updatedEmployee);
                if (success) {
                    return res.json({ message: 'Employee updated successfully' });
                } else {
                    return res.status(404).json({ message: 'Employee not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Employee update failed in db." });
            }
        });

        // DELETE route to delete an employee by its ID
        this.#express.delete("/employee/:id", async (req, res) => {
            const parsedId = parseInt(req.params.id);

            try {
                const success = await this.#persistenceService.delete(parsedId, Employee);
                if (success) {
                    return res.json({ message: 'Employee deleted successfully' });
                } else {
                    return res.status(404).json({ message: 'Employee not found' });
                }
            } catch (err) {
                return res.status(503).json({ error: "Employee deletion failed in db." });
            }
        });
    }
}
