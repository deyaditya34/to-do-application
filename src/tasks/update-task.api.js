const httpError = require("http-errors");
const tasksService = require("./tasks.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoryService = require("../categories/categories.service");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

async function controller(req, res) {
  const { updateDetails, taskId } = req.body;

  const result = await tasksService.updateTask(taskId, updateDetails);

  if (result.modifiedCount === 1) {
    res.json({
      message: "task updated",
      data: result.acknowledged,
    });
  } else {
    res.json({
      message: "unable to update task as it is already updated",
    });
  }
}

async function validateParams(req, res, next) {
  const { updateDetails, taskId, user } = req.body;
  const parsedUpdateDetails = {};
  let updateElements = Object.keys(updateDetails);

  const errorTypedFields = updateElements.filter((field) => {
    return typeof Reflect.get(req.body.updateDetails, field) !== "string";
  });

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Fields '${errorTypedFields.join(",")}' should be 'string' type.`
    );
  }

  if (updateDetails.title) {
    parsedUpdateDetails["title"] = updateDetails.title;
  }

  if (updateDetails.description) {
    parsedUpdateDetails["description"] = updateDetails.description;
  }

  if (updateDetails.dueDate) {
    if (!dayjs(updateDetails.dueDate, "YYYY-MM-DD").isValid()) {
      throw new httpError.BadRequest(
        `Field duedate - '${updateDetails.dueDate}' should be of 'string' type`
      );
    }
  }

  if (updateDetails.categoryId) {
    const categoryValidator = await categoryService.getCategory(categoryId);

    if (!categoryValidator) {
      throw new httpError.BadRequest(
        `Field categoryId - '${categoryId} is invalid.`
      );
    } else {
      parsedUpdateDetails["categoryId"] = updateDetails.categoryId;
    }
  }

  if (typeof taskId !== "string") {
    throw new httpError.BadRequest(
      `Field taskId - '${taskId}' should be of 'string' type.`
    );
  }

  const taskIdValidator = await tasksService.getTask(taskId, user.username);

  if (!taskIdValidator) {
    throw new httpError.BadRequest(`Field taskId - '${taskId}' is invalid.`);
  }

  parsedUpdateDetails["dueDate"] = dayjs(
    updateDetails.dueDate,
    "YYYY-MM-DD"
  ).format();

  Reflect.set(req.body, "updateDetails", parsedUpdateDetails);
  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["updateDetails", "taskId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
