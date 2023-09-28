const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const tasksService = require("./tasks.service");

async function controller(req, res) {
  const {taskId, status} = req.body;

  const result = await tasksService.updateTask(taskId, {status});

  res.json({
    message: "status updated",
    data: result.acknowledged,
  })
}

async function validateParams(req, res, next) {
  const {user} = req.body;
  const reqElements = Object.keys(req.body);
  // For deleting 'user' sent from userResolver
  reqElements.pop();

  const errorTypedFields = reqElements.filter((field) => {
    return typeof Reflect.get(req.body, field) !== "string";
  })

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Field '${errorTypedFields.join(", ")}' should be of 'string' type.`
    )
  }

  const taskIdValidator = await tasksService.getTask(req.body.taskId, user.username);

  if (!taskIdValidator) {
    throw new httpError.BadRequest(
      `Field taskId - '${req.body.taskId}' is invalid.`
    )
  }

  if ((req.body.status !== "pending" && req.body.status !== "complete")) {
    throw new httpError.BadRequest(
      `Field status '${req.body.status}' is invalid. It should either be 'pending' or 'complete'.`
    )
  }

  if (taskIdValidator.status === req.body.status) {
    throw new httpError.BadRequest(
      `Field status - '${req.body.status}' is already updated.`
    )
  }
  
  next();
}


const missingParamsValidator = paramsValidator.createParamsValidator(
  ["taskId", "status"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
