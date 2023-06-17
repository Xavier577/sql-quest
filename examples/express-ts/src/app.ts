import express from "express";
import apiRouter from "./api/routes/index.router";
import sqlQuestFactory from "../../../src";
import {configDotenv} from "dotenv";
import * as process from "process";

configDotenv()

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DATABASE_URL = String(process.env.DATABASE_URL)

const sqlQuest = sqlQuestFactory({ databaseUrl: DATABASE_URL})

;(async function () {

  const result = await sqlQuest.any(`SELECT * FROM users;`)

   console.log(result)


})()


app.get("/", async (_req, res) => {
  res.send("<h1>let's code!</h1>");
});
app.use("/api", apiRouter);

export default app;
