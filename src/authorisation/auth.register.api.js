const buildApiHandler = require("../api-utils/build-api-handler");
const checkAdminRights = require("../middlewares/check-admin-rights");
const paramsValidator = require("../middlewares/params-validator");
const userResolver = require("../middlewares/user-resolver");
const authService = require("./auth.service");
const authUtils = require("./auth.utils");

async function controller(req, res) {
  const { username, password } = req.body;

  await authService.register(username, password);

  res.json({
    success: true,
    data: username,
  });
}

const usernameValidator = authUtils.validateUsername;

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  checkAdminRights,
  missingParamsValidator,
  usernameValidator,
  controller,
]);
