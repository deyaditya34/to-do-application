const httpError = require("http-errors");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const categoriesService = require("./categories.service");

async function controller(req, res) {
  const { categoryDetails, categoryId } = req.body;

  const result = await categoriesService.updateCategory(
    categoryId,
    categoryDetails
  );

  if (result.modifiedCount === 1) {
    res.json({
      message: "Category Details Updated",
      data: result.acknowledged,
    });
  } else {
    res.json({
      message: "category Details already Up to Date",
      success: false,
    });
  }
}

async function validateParams(req, res, next) {
  let parsedCategoryDetails = {};

  if (!req.body.categoryDetails.categoryName) {
    throw new httpError.BadRequest(
      `Field 'categoryName' is missing from 'categoryDetails' - '${req.body.categoryDetails}'. `
    );
  }

  const errorTypedFields = ["categoryName"].filter((field) => {
    return typeof Reflect.get(req.body.categoryDetails, field) !== "string";
  });

  if (errorTypedFields.length > 0) {
    throw new httpError.BadRequest(
      `Field '${errorTypedFields.join(", ")}' should be 'string' type.`
    );
  } else {
    parsedCategoryDetails["categoryDetails.categoryName"] =
      req.body.categoryDetails.categoryName;
  }

  const categoryIdValidator = await categoriesService.getCategory(
    req.body.categoryId
  );

  if (!categoryIdValidator) {
    throw new httpError.BadRequest(
      `Field categoryId - '${req.body.categoryId}' is invalid.`
    );
  }

  Reflect.set(req.body, "categoryDetails", parsedCategoryDetails);
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["categoryDetails", "categoryId"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  validateParams,
  controller,
]);
