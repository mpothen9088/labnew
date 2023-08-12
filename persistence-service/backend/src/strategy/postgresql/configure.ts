import { DataSource } from "typeorm";
import { Truck } from "./truck/truck";
import { Employee } from "./employee/employee";
import { Driver } from "./driver/driver";
import { Mechanic } from "./mechanic/mechanic";customer
import { Customer } from "./customer/customer";
import { Breakdown } from "./breakdown/breakdown";
import { Shipment } from "./shipment/shipment";
import { Trip } from "./trip/trip";
import { TripDriver } from "./tripdriver/tripdriver";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Truck,Employee,Driver,Mechanic,Breakdown,Customer,Shipment,Trip,TripDriver],
  synchronize: true,
  logging: false,
});
