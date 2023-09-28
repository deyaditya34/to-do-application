const httpError = require("http-errors");
const config = require("../config");
const authService = require("../authorisation/auth.service")

async function userResolver(req, res, next) {
  const token = Reflect.get(req.headers, config.AUTH_TOKEN_HEADER_FIELD);

  if (!token) {
    throw new httpError.Forbidden("Access Denied")
  }

  const user = await authService.getUserFromToken(token);

  if (!user) {
    throw new httpError.Forbidden("Invalid User");
  }

  Reflect.set(req.body, "user", user);

  next();
}

module.exports = userResolver;