# Persistence Service

## Introduction

Persistence-service is a backend service designed to manage and persist data for various entities like trucks, employees, shipments, etc.

## Prerequisites

* Docker
* Docker Compose

## Dependencies

The project uses the following main dependencies:
* express: For setting up the server.
* typeorm: For ORM-based database operations.
* pg: PostgreSQL client for Node.js.
* axios: For making HTTP requests.
* Node.js

## Configuration

Environment variables are provided in docker-compose.yml file.

## Running the Service

* Open /persistence-service/backend/src/server.ts file and ensure: const USE_MOCK = true;   This will run mockedTypeOrmPersistence.

* From the root directory, run: docker-compose up —build  
* The service will be available at http://localhost:80.

Note: Perform the below steps once the container is up and running.

## Validate API Endpoints

APIs for truck:
* GET /truck/:id: Fetches data from the truck table by its ID.
* POST /truck: Adds new data to the truck table.
* PUT /truck/:id: Update data in the table by its ID.
* DELETE /truck/:id: Delete data from the truck table by its ID.

Similarly, check for remaining tables:
* employee
* driver
* mechanic
* breakdown
* customer
* shipment
* trip
* tripdriver
* tripshipment

## Unit testing

From the root directory, run:
sudo docker exec -u root -it persistence-service_backend_1 npm test -- Api.test.ts

This command runs all test suites matching /Api.test.ts/i. 
Results will be displayed in the console.

## Integration testing

* Open /persistence-service/backend/src/server.ts file and ensure: const USE_MOCK = false;   This will run typeOrmPersistence.

* From the integration-tests directory, run: docker-compose up —build

*  Integration test in integration-tests/src/smoke.test.ts will run and results will be displayed in the console.
