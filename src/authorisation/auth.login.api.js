const authService = require("./auth.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const paramsValidator = require("../middlewares/params-validator");
const authUtils = require("../authorisation/auth.utils");

async function controller(req, res) {
  const { username, password } = req.body;

  const token = await authService.login(username, password);

  res.json({
    success: true,
    data: {
      username,
      token,
    },
  });
}

const usernameValidator = authUtils.validateUsername;

const missingParamsValidator = paramsValidator.createParamsValidator(
  ["username", "password"],
  paramsValidator.PARAM_KEY.BODY
);


module.exports = buildApiHandler([
  missingParamsValidator,
  usernameValidator,
  controller
])