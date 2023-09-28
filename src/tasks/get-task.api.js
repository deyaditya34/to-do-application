const httpError = require("http-errors");
const buildApiHander = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const tasksService = require("./tasks.service");

async function controller(req, res) {
  const {taskId, user} = req.body;

  const result = await tasksService.getTask(taskId, user.username);

  if (result) {
    res.json({
      message: "Task Found",
      data: result
    })
  } else {
    res.json({
      message: "No Task Found"
    })
  }
}

async function validateParams(req, res, next) {
  const { taskId } = req.body;

  if (typeof taskId !== "string") {
    throw new httpError.BadRequest(
      `Field taskId - '${taskId}' should be 'string' type.`
    );
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["taskId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHander([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
