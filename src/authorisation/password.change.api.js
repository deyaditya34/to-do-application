const authService = require("./auth.service");
const authUtils = require("./auth.utils");
const userResolver = require("../middlewares/user-resolver");
const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");

async function controller(req, res) {
  const { user, username, password, newPassword } = req.body;

  const userDetails = await authService.retrieveUserDetails(user.username);

  const changePassword = await authService.changePassword(user, username, password, newPassword);
  
  res.json({
    message: "Password Changed",
  })
}

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password", "newPassword"],
  paramsValidator.PARAM_KEY.BODY
);

module.exports = buildApiHandler([
  userResolver,
  missingParamsValidator,
  authUtils.validateUsername,
  controller
])