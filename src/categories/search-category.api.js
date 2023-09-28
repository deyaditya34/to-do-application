const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoriesService = require("./categories.service");
const pagination = require("../middlewares/pagination");

async function controller(req, res) {
  const { categoryName } = req.body.categoryDetails;
  const { pageNo, pageSize } = req.query;

  const result = await categoriesService.searchCategory({
    categoryName,
    pageNo,
    pageSize,
  });

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
  const reqElements = Object.keys(req.body.categoryDetails);
  let parsedCategoryDetails = {};

  const errorTypedFields = reqElements.filter((field) => {
    return typeof Reflect.get(req.body.categoryDetails, field) !== "string";
  });

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Field '${errorTypedFields.join(", ")}' should be 'string' type.`
    );
  }
  if (req.body.categoryDetails.categoryName) {
    parsedCategoryDetails["categoryDetails.categoryName"] =
      req.body.categoryDetails.categoryName;
  }

  Reflect.set(req.body, "categoryDetails", parsedCategoryDetails);
  next();
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["categoryDetails"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  pagination,
  controller,
]);
