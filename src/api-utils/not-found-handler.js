const httpError = require("http-errors");

function notFoundHandler(req, res, next) {
  next(httpError.NotFound("Resource not Found"));
}

module.exports = notFoundHandler;