import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import productRoutes from  "./routes/productRoute";
import categoryRoutes from "./routes/categoryRoute"
import { errorMiddleware } from "./middleware/errorMiddleware";
import { AppError } from "./middleware/errorhandler";
import multer = require("multer");
import path = require("path");
import Joi  = require("joi");
import emailLayoutRoute from "./routes/emailLayoutRoute";



dotenv.config();
const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", emailLayoutRoute);
app.use("/uploads",express.static(path.join(__dirname,"uploads")));


//global error handler middleware
app.use(errorMiddleware);
console.log("excuted index.ts file");
// mongoDb connection
const dbURL =
  process.env.DB_URL ||(process.env.NODE_ENV === "docker"? process.env.DOCKER_DB_URL: process.env.LOCAL_DB_URL);
if (!dbURL) {
  throw new Error("Database connection string (DB_URL) is not defined!");
}
mongoose
  .connect(dbURL)
  .then(() => {
    console.log(`Connected to MongoDB at ${dbURL}`);
    // const port = process.env.PORT ;
    app.listen(process.env.PORT, () => {
      console.log(`Server running at the port no: ${process.env.PORT}`);
    });
  })
  .catch((e) => {
    console.error("Error in connecting to MongoDB",e);
  });

// mongoose
//   .connect(process.env.DB_URL || "mongodb://mongodb:27017/Db_newproject",)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running at the port no: ${process.env.PORT}`);
//     });
//   })
//   .catch((e) => {
//     console.error("Error in connecting to MongoDB", e);
//   });

 
