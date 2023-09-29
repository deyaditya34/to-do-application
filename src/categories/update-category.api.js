const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const categoriesService = require("./categories.service");

async function controller(req, res) {
  const { updateDetails } = req.body;
  const { id } = req.params;

  const result = await categoriesService.updateCategory(id, updateDetails);

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
  const { categoryName } = req.body;
  const { id } = req.params;

  let parsedUpdateDetails = {};
  
  if (typeof categoryName !== "string") {
    throw new httpError.BadRequest(`
    Field '${categoryName}' should be of 'string' type.`);
  }
  
  parsedUpdateDetails["categoryName"] = categoryName;

  const getCategory = await categoriesService.getCategory(id);

  if (!getCategory) {
    throw new httpError.BadRequest(`Field categoryId - '${id}' is invalid.`);
  }

  Reflect.set(req.body, "updateDetails", parsedUpdateDetails);
  next();
}

module.exports = buildApiHandler([
  userResolver,
  validateParams,
  controller,
]);
