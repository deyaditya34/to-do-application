const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoriesService = require("./categories.service");

async function controller(req, res) {
  const result = await categoriesService.getCategory(req.body.categoryId);

  if (result) {
    res.json({
      message: "Category Found",
      data: "result",
    });
  } else {
    res.json({
      message: "No Category Found",
      success: false,
    });
  }
}

function validateParams(req, res, next) {
  const { categoryId } = req.body;

  if (typeof categoryId !== "string") {
    throw new httpError.BadRequest(
      `Field categoryId - '${categoryId}' should be 'string' type.`
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
