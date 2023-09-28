const categoryService = require("./categories.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const pagination = require("../middlewares/pagination");
const httpError = require("http-errors");

async function controller(req, res) {
  const { categoryName } = req.body;
  
  const result = await categoryService.createCategory({ categoryName });

  res.json({
    message: "category created",
    data: result,
  });
}

async function validateParams(req, res, next) {
  if (typeof Reflect.get(req.body, "categoryName") !== "string") {
    throw new httpError.BadRequest(
      " Field 'categoryName' should be of string type"
    );
  }

  const { categoryName } = req.body;
  const {pageNo, pageSize} = req.query;

  const categoryValidator = await categoryService.searchCategory(
    { categoryName },
    pageNo,
    pageSize
  );

  if (categoryValidator.length > 0) {
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
  pagination,
  validateParams,
  controller,
]);
