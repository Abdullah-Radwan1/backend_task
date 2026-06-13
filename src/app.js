import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiRouter from "./routes/index.js";
import { globalErrorHandler } from "./utils/globalErrorhandler.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

// Initialize env config
dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// Request logging
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Mount API routes
app.use("/v1", apiRouter);

// Fallback for undefined routes (404)
app.use((req, res, next) => {
  const err = new Error(`Route Not Found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
});

// Centralized error handler
app.use(globalErrorHandler);
export default app;
