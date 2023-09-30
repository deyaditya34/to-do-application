const httpError = require("http-errors");

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
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

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  controller,
]);
