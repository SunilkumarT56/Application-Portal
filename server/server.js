import express from "express";
import cors from "cors";
import "dotenv/config";
import connedtDB from "./config/db.js";
const PORT = process.env.PORT;
const app = express();

await connedtDB();

//Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on Port ${PORT}`);
});
