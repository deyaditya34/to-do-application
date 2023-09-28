const authService = require("./auth.service");
const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const paramsValidator = require("../middlewares/params-validator");
const authUtils = require("./auth.utils");
const { checkAdminRights } = require("./auth.register.api");

async function controller(req, res) {
  const { query } = req.body;

  const result = await authService.findUsers({
    ...query,
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
  ["query"],
  paramsValidator.PARAM_KEY.BODY
);

function validateUsername(req, res, next) {
  const { username } = req.body.query;

  let parsedQuery = {};

  if (typeof username === "string") {
    parsedQuery.username = { $regex: username };
  }

  Reflect.set(req.body, "query", parsedQuery);
  next;
}

module.exports = buildApiHandler([
  userResolver,
  checkAdminRights,
  missingParamsValidator,
  validateUsername,
  controller,
]);
