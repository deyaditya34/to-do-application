const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoriesService = require("./categories.service");
const pagination = require("../middlewares/pagination");

async function controller(req, res) {
  const { searchCriteria, pageNo, pageSize } = req.query;

  const result = await categoriesService.searchCategory(
    { ...searchCriteria },
    pageNo,
    pageSize
  );

  if (result.length === 0) {
    res.json({
      message: "No Categories Found",
      success: false,
    });
  } else {
    res.json({
      message: "Categories Found",
      data: result,
    });
  }
}

function validateParams(req, res, next) {
  const { categoryName } = req.query;
  let searchCriteria = {};

  searchCriteria["categoryName"] = categoryName;

  Reflect.set(req.query, "searchCriteria", searchCriteria);
  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["categoryName"],
  paramsValidator.PARAM_KEY.QUERY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  pagination,
  controller,
]);
