const express = require("express");
const config = require("./config");

const database = require("./services/database.service");
const notFoundHandler = require("./api-utils/not-found-handler");
const errorHandler = require("./api-utils/error-handler");
const requestLogger = require("./middlewares/request-logger");
const authRouter = require("./authorisation/auth.api.router");
const categoryRouter = require("./categories/categories.api.router")
const taskRouter = require("./tasks/tasks.api.router")

async function start() {
  console.log("[Init]: Connecting to database...");

  await database.initialize();

  console.log("[Init]: Starting Server...");

  const server = express();

  server.use(express.json());
  server.use(requestLogger);

  server.use("/auth", authRouter);
  server.use("/categories", categoryRouter);
  server.use("/tasks", taskRouter);

  server.use(notFoundHandler);
  server.use(errorHandler);

  server.listen(config.APP_PORT, () => {
    console.log("[Init]: to-do application running on ", config.APP_PORT);
  });
}

start().catch((err) => {
  console.log("[fatal]: could not start to-do-application");
  console.log(err)
});