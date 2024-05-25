import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import dbconnection from "./db/config";
import startupRoutes from "./startup/startup-routes";
import { errorHandler } from "./middleware/error-handler";


dotenv.config();
const app = express();
app.use(cors())
app.use(express.json())


startupRoutes(app)

app.get("/api", async(req, res) => {
  res.send({ message: "Welcome to auth-api-server!!!" });
});

app.get("*", (req, res) => {
  res.send({ message: "Routes Not Found" });
});
app.use(errorHandler);

export { app };