import pool from "./utils/DB.js";
import "./utils/initDB.js";
import { urlsRouter } from "./routes/urls.router.js";
import redisClient from "./utils/redis.js";
import {
  httpRequestDuration_middleware,
  httpRequestCounter_middleware,
} from "./middleware/metrics.middleware.js";
import { metrics } from "./utils/promClient.js";

import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "url shortner api" });
});

app.get("/health", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/api/metrics", metrics);
app.use(
  "/api",
  httpRequestCounter_middleware,
  httpRequestDuration_middleware,
  urlsRouter,
);

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log({ level: "info", message: `Server is running on port ${PORT}` });
  pool.query("SELECT NOW()", (err, res) => {
    if (err) {
      console.error({ level: "error", message: err.message });
    } else {
      console.log({ level: "info", message: "Database connected" });
    }
  });
});
