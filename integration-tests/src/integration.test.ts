import axios from "axios";

const targetUrl = `${process.env.TARGET_URL}`;

const tables = {
    truck: {
        fields: ['brand', 'load', 'capacity', 'year', 'number_of_repairs'],
        data: {
            brand: 'Test Truck Brand',
            load: 500,
            capacity: 1500,
            year: 2022,
            number_of_repairs: 2
        },
        updatedData: {
            brand: 'Updated Truck Brand',
            load: 600
        }
    },
    employee: {
        fields: ['first_name', 'last_name', 'seniority'],
        data: {
            first_name: 'Manu',
            last_name: 'Pothen',
            seniority: '5 years'
        },
        updatedData: {
            first_name: 'Bibin'
        }
    },
    driver: {
        fields: ['employee_id', 'category'],
        data: {
            employee_id: 1,
            category: 'Heavy'
        },
        updatedData: {
            category: 'Light'
        }
    },
    mechanic: {
        fields: ['employee_id', 'specialized_brand'],
        data: {
            employee_id: 2,
            specialized_brand: 'BrandX'
        },
        updatedData: {
            specialized_brand: 'BrandY'
        }
    },
    breakdown: {
        fields: ['truck_id', 'mechanic_id', 'estimated_repair_time'],
        data: {
            truck_id: 1,
            mechanic_id: 1,
            estimated_repair_time: 3
        },
        updatedData: {
            estimated_repair_time: 4
        }
    },
    customer: {
        fields: ['name', 'address', 'phone_number1', 'phone_number2'],
        data: {
            name: 'Manu',
            address: 'Waterloo, Ontario',
            phone_number1: '1234567890',
            phone_number2: '0987654321'
        },
        updatedData: {
            address: 'University Avenue, Waterloo'
        }
    },
    shipment: {
        fields: ['weight', 'value', 'origin', 'destination', 'customer_id'],
        data: {
            weight: 1000,
            value: 5000,
            origin: 'Toronto',
            destination: 'Kitchner',
            customer_id: 1
        },
        updatedData: {
            destination: 'Waterloo'
        }
    },
    trip: {
        fields: ['route_from', 'route_to'],
        data: {
            route_from: 'PointA',
            route_to: 'PointB'
        },
        updatedData: {
            route_to: 'PointC'
        }
    },
    tripdriver: {
        fields: ['trip_id', 'driver_id'],
        data: {
            trip_id: 1,
            driver_id: 1
        },
        updatedData: {
            driver_id: 2
        }
    },
    tripshipment: {
        fields: ['trip_id', 'shipment_id'],
        data: {
            trip_id: 1,
            shipment_id: 1
        },
        updatedData: {
            shipment_id: 2
        }
    }
};

for (const [table, config] of Object.entries(tables)) {
    describe(`Integration tests for /${table} API`, () => {
        let createdId: number;

        it(`should create a new ${table} and return 200`, async () => {
            const response = await axios.post(`http://${targetUrl}/${table}`, config.data);
            expect(response.status).toBe(200);
            expect(response.data.id).toBeDefined();
            createdId = response.data.id;
        });

        it(`should fetch the created ${table} by its ID and return 200`, async () => {
            const response = await axios.get(`http://${targetUrl}/${table}/${createdId}`);
            expect(response.status).toBe(200);
        });

        it(`should update the created ${table} by its ID and return 200`, async () => {
            const response = await axios.put(`http://${targetUrl}/${table}/${createdId}`, config.updatedData);
            expect(response.status).toBe(200);
        });

        it(`should delete the ${table} by its ID and return 200`, async () => {
            const response = await axios.delete(`http://${targetUrl}/${table}/${createdId}`);
            expect(response.status).toBe(200);
        });
    });
}
