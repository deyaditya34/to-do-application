const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const tasksService = require("./tasks.service");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
const categoryService = require("../categories/categories.service");
const pagination = require("../middlewares/pagination");

async function controller(req, res) {
  const { taskDetails, user } = req.body;
  const { pageNo, pageSize } = req.query;

  const result = await tasksService.searchTask(
    taskDetails,
    user.username,
    pageNo,
    pageSize
  );

  res.json({
    message: "search result are -",
    data: result,
  });
}

async function validateParams(req, res, next) {
  const searchElement = Object.keys(req.body.taskDetails);
  searchElement.pop();
  const errorTypedFields = searchElement.filter((field) => {
    return typeof Reflect.get(req.body.taskDetails, field) !== "string";
  });

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Fields '${errorTypedFields.join(", ")}' should be of 'string' type.`
    );
  }

  const parsedTaskDetails = {};

  if (req.body.taskDetails.title) {
    parsedTaskDetails["title"] = req.body.taskDetails.title;
  }

  if (req.body.taskDetails.description) {
    parsedTaskDetails["description"] = req.body.taskDetails.description;
  }

  if (req.body.taskDetails.dueDate) {
    if (!dayjs(req.body.taskDetails.dueDate, "YYYY-MM-DD").isValid()) {
      throw new httpError.BadRequest(
        `Field dueDate - '${req.body.taskDetails.dueDate}' is invalid. It should be in 'YYYY-MM-DD' format.`
      );
    }
    parsedTaskDetails["dueDate"] = dayjs(
      req.body.taskDetails.dueDate,
      "YYYY-MM-DD"
    ).format();
  }

  if (req.body.taskDetails.categoryId) {
    const categoryValidator = await categoryService.getCategory(
      req.body.taskDetails.categoryId
    );

    if (!categoryValidator) {
      throw new httpError.BadRequest(
        `Field categoryID - '${req.body.taskDetails.categoryId}' is invalid.`
      );
    }

    parsedTaskDetails["categoryId"] = req.body.taskDetails.categoryId;
  }

  if (req.body.taskDetails.status) {
    if (
      req.body.taskDetails.status !== "pending" ||
      req.body.taskDetails.status !== "complete"
    ) {
      throw new httpError.BadRequest(
        `Field status - '${req.body.taskDetails.status}' is invalid. It should either be 'pending' or 'complete'.`
      );
    }

    parsedTaskDetails["status"] = req.body.taskDetails.status;
  }

  if (req.body.taskDetails.createdDate) {
    if (!dayjs(req.body.taskDetails.createdDate, "YYYY-MM-DD").isValid()) {
      throw new httpError.BadRequest(
        `Field createdDate - '${req.body.taskDetails.createdDate}' is invalid. It should be in 'YYYY-MM-DD' format.`
      );
    }
    parsedTaskDetails["createdDate"] = dayjs(
      req.body.taskDetails.createdDate,
      "YYYY-MM-DD"
    ).format();
  }

  Reflect.set(req.body, "taskDetails", parsedTaskDetails);
  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["taskDetails"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  pagination,
  controller,
]);
