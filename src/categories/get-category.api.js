const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoriesService = require("./categories.service");

async function controller(req, res) {
  const result = await categoriesService.getCategory(req.params.id);

  if (result) {
    res.json({
      message: "Category Found",
      data: result,
    });
  } else {
    res.json({
      message: "No Category Found",
      success: false,
    });
  }
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["id"],
  paramsValidator.PARAM_KEY.PARAMS
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
