const httpError = require("http-errors");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

const tasksService = require("./tasks.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoryService = require("../categories/categories.service");

async function controller(req, res) {
  const { updateDetails } = req.body;
  const { id } = req.params;

  const result = await tasksService.updateTask(id, updateDetails);

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
  const { updateDetails, user } = req.body;
  const { id } = req.params;
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

    parsedUpdateDetails["dueDate"] = dayjs(
      updateDetails.dueDate,
      "YYYY-MM-DD"
    ).format();
  }

  if (updateDetails.categoryId) {
    const getCategory = await categoryService.getCategory(categoryId);

    if (!getCategory) {
      throw new httpError.BadRequest(
        `Field categoryId - '${categoryId} is invalid.`
      );
    } else {
      parsedUpdateDetails["categoryId"] = updateDetails.categoryId;
    }
  }

  const getTask = await tasksService.getTask(id, user.username);

  if (!getTask) {
    throw new httpError.BadRequest(`Field taskId - '${id}' is invalid.`);
  }

  Reflect.set(req.body, "updateDetails", parsedUpdateDetails);
  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["updateDetails"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
