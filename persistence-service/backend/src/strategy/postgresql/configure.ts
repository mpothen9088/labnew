import { DataSource } from "typeorm";
import { Truck } from "./truck/truck";
import { Employee } from "./employee/employee";

export const postgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Truck,Employee],
  synchronize: true,
  logging: false,
});
