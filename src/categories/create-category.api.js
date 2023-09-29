const httpError = require("http-errors");

const categoryService = require("./categories.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { categoryName } = req.body;

  const result = await categoryService.createCategory({ categoryName });

  res.json({
    message: "category created",
    data: result,
  });
}

async function validateParams(req, res, next) {
  const { categoryName } = req.body;
  
  if (typeof categoryName !== "string") {
    throw new httpError.BadRequest(
      " Field 'categoryName' should be of string type"
    );
  }

  const existingCategory = await categoryService.getCategoryByName(
    categoryName
  );

  if (existingCategory) {
    throw new httpError.BadRequest(`Category '${categoryName}' already exists`);
  }

  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["categoryName"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
