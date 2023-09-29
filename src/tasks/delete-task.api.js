const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const tasksService = require("./tasks.service");
const userResolver = require("../middlewares/user-resolver");

async function controller(req, res) {
  const { id } = req.params;

  const result = await tasksService.deleteTask(id);

  res.json({
    message: "Task Deleted",
    data: result.acknowledged,
  });
}

async function validateParams(req, res, next) {
  const { id } = req.params;
  const {user} = req.body;

  const getTask = await tasksService.getTask(id, user.username);

  if (!getTask) {
    throw new httpError.BadRequest(`Field taskId - '${id} is invalid.`);
  }

  next();
}

module.exports = buildApiHandler([
  userResolver,
  validateParams,
  controller,
]);
