import cors from "cors";
import express, { json } from "express";
import postgresDataSource from "./strategy/postgresql";
import PhotoApi from "./strategy/postgresql/photo";
import TypeOrmService from "./persistenceService/typeOrmPersistence/typeOrmPersistence"; // Import the TypeOrmService

(async () => {
  const app = express();
  app.use(cors());
  app.use(json());

  const datasource = await postgresDataSource.initialize();
  const persistenceService = new TypeOrmService(datasource); // Create an instance of TypeOrmService

  new PhotoApi(persistenceService, app); // Pass the TypeOrmService instance instead of the raw datasource
  app.get("/", (_, res) => {
    return res.send("hello world");
  });

  app.listen(8000, () => {
    console.log(`express server started on 8000`);
  });
})().catch((err) => console.log(err));
