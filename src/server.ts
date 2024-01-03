import express from "express";
import dotenv from "dotenv";
import { dbConnectionMiddleware } from ".//config/dbConnection";
import router from "./routes";
import path from "path";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());
app.use(dbConnectionMiddleware);
app.use(router);
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "uploads/")));
console.log(process.env.BACK_PORT)
app.listen(process.env.BACK_PORT, () => {
  console.log(
    `⚡⚡⚡ server running : http://localhost:${process.env.BACK_PORT}`
  );
});