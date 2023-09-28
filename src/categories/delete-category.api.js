const httpError = require("http-errors");
const categoriesService = require("./categories.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { categoryId } = req.body;

  const result = await categoriesService.deleteCategory(categoryId);

  res.json({
    message: "Category Deleted",
    data: result.acknowledged,
  });
}

async function validateParams(req, res, next) {
  const { categoryId } = req.body;

  if (typeof categoryId !== "string") {
    throw new httpError.BadRequest(
      `Field categoryId - '${categoryId}' should be of 'string' type.`
    );
  }

  const categoryIdValidator = await categoriesService.getCategory(categoryId);

  if (!categoryIdValidator) {
    throw new httpError.BadRequest(
      `Field categoryId - '${categoryId}' is invalid.`
    );
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["categoryId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
