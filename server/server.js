import express from "express";
import cors from "cors";
import "dotenv/config";
import connedtDB from "./config/db.js";
const PORT = process.env.PORT;
const app = express();
import "./config/instrument.js";
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from "./controllers/webhooks.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import connectClodinary from "./config/cloudinary.js";
import {clerkMiddleware} from "@clerk/express";

await connedtDB();
await connectClodinary();

//Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

//routes
app.post("/webhooks", clerkWebhooks);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("api is working");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});



Sentry.setupExpressErrorHandler(app);
app.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on Port ${PORT}`);
});
