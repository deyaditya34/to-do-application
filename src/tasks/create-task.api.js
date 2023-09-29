const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);
const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const pagination = require("../middlewares/pagination");
const categoryService = require("../categories/categories.service");
const tasksService = require("./tasks.service");

async function controller(req, res) {
  const { title, description, categoryDetails, dueDate, user } = req.body;

  const transactionCreated = await tasksService.createTask({
    title,
    description,
    categoryName: categoryDetails.categoryName,
    dueDate,
    status: "pending",
    createdAt: dayjs(new Date()).format(),
    createdBy: user.username,
  });

  res.json({
    message: "Task Created",
    taskId: transactionCreated.insertedId,
  });
}

async function validateParams(req, res, next) {
  const errorTypedFields = ["title", "description"].filter((field) => {
    typeof Reflect.get(req.body, field) !== String;
  });

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Field - '${errorTypedFields.join(",")}' should be string type`
    );
  }

  const { categoryId, dueDate } = req.body;

  if (categoryId) {
    if (typeof categoryId !== "string") {
      throw new httpError.BadRequest(
        `Field categoryID - '${categoryId}' should be string type.`
      );
    }

    const getCategory = await categoryService.getCategory(categoryId);

    if (!getCategory) {
      throw new httpError.BadRequest(
        `Field categoryId - '${categoryId}' is invalid.`
      );
    }
    Reflect.set(req.body, "categoryDetails", getCategory);
  }

  if (dueDate) {
    if (typeof dueDate !== "string") {
      throw new httpError.BadRequest(`Date '${dueDate}' must be string type`);
    }

    if (!dayjs(dueDate, "YYYY-MM-DD").isValid()) {
      throw new httpError.BadRequest(
        `Invalid Due Date - '${dueDate}'. Format should be 'year-month-day'`
      );
    }

    Reflect.set(req.body, "dueDate", dayjs(dueDate, "YYYY-MM-DD").format());
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["title", "description"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  pagination,
  controller,
]);
