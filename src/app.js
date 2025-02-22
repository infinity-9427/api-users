import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import { connectToDatabase } from "./helpers/helper.js";

const app = express();

export const createApp = ({ port }) => {
  app.use(morgan("dev"));

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" })); // URL-encoded parser
  app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  );

  (async () => {
    try {
      await connectToDatabase();
      console.log("App is running and connected to Database");
    } catch (error) {
      console.error("Database connection failed!", error.message);
      process.exit(1);
    }
  })();

  return { app, port };
};
