const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const tasksService = require("./tasks.service");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoryService = require("../categories/categories.service");

async function controller(req, res) {
  const { taskId } = req.body;

  const result = await tasksService.deleteTask(taskId);

  res.json({
    message: "Task Deleted",
    data: result.acknowledged,
  });
}

async function validateParams(req, res, next) {
  const { taskId, user } = req.body;

  if (typeof taskId !== "string") {
    throw new httpError.BadRequest(
      `Field categoryId - '${taskId}' should be string type.`
    );
  }

  const taskIdValidator = await tasksService.getTask(taskId, user.username);

  if (!taskIdValidator) {
    throw new httpError.BadRequest(`Field categoryId - '${taskId} is invalid.`);
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["taskId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
