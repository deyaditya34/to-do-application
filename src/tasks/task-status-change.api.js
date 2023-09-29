const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const tasksService = require("./tasks.service");

async function controller(req, res) {
  const { id, newStatus } = req.params;

  const result = await tasksService.updateTask(id, { status: newStatus });

  res.json({
    message: "status updated",
    data: result.acknowledged,
  });
}

async function validateParams(req, res, next) {
  const { id, newStatus } = req.params;
  const {user} = req.body;

  const getTask = await tasksService.getTask(id, user.username);

  if (!getTask) {
    throw new httpError.BadRequest(`Field id - '${id}' is invalid.`);
  }

  if (newStatus !== "pending" && req.body.status !== "complete") {
    throw new httpError.BadRequest(
      `Field newStatus '${newStatus}' is invalid. It should either be 'pending' or 'complete'.`
    );
  }

  if (getTask.status === newStatus) {
    throw new httpError.BadRequest(
      `Field status - '${newStatus}' is already updated for the id - '${id}'.`
    );
  }

  next();
}

module.exports = buildApiHandler([userResolver, validateParams, controller]);
