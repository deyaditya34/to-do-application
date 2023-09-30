const authService = require("./auth.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const { checkAdminRights } = require("./auth.register.api");

async function controller(req, res) {
  const { username } = req.params;

  const result = await authService.findUsers({
    username: username,
    role: { $ne: "ADMIN" },
  });

  if (result.length === 0) {
    res.json({
      message: "No User Found"
    })
  } else {
    res.json({
      message: "Users Found",
      data: result,
    })
  }
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username"],
  paramsValidator.PARAM_KEY.PARAMS
);

module.exports = buildApiHandler([
  userResolver,
  checkAdminRights,
  missingParamsValidator,
  controller,
]);
