const httpError = require("http-errors");

const categoriesService = require("./categories.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { id } = req.params;

  const result = await categoriesService.deleteCategory(id);

  res.json({
    message: "Category Deleted",
    success: result.acknowledged,
  });
}

async function validateParams(req, res, next) {
  const { id } = req.params;

  const getCategory = await categoriesService.getCategory(id);

  if (!getCategory) {
    throw new httpError.BadRequest(
      `Field id - '${id}' is invalid.`
    );
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["id"],
  paramsValidator.PARAM_KEY.PARAMS
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
