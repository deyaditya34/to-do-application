const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const pagination = require("../middlewares/pagination");
const httpError = require("http-errors");
const categoryService = require("../categories/categories.service");
const tasksService = require("./tasks.service");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat);

async function controller(req, res) {
  const { title, description, category, dueDate, user, status } = req.body;

  const transactionCreated = await tasksService.createTask({
    title,
    description,
    category,
    dueDate,
    status,
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

    const categoryValidator = await categoryService.getCategory(categoryId);

    if (!categoryValidator) {
      throw new httpError.BadRequest(
        `Field categoryId - '${categoryId}' is invalid.`
      );
    }
  } else {
    const defaultCategory = await categoryService.getCategory(
      "65147cabcce28d2332ff406e"
    );
    Reflect.set(req.body, "category", defaultCategory.categoryName);
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
  } else {
    Reflect.set(req.body, "dueDate", "not Set");
  }
  
  Reflect.set(req.body, "status", "pending");

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
