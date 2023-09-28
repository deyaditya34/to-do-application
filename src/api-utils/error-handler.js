const httpError = require("http-errors");

function errorHandler(err, req, res, next) {
    console.log("API Error -", err);

    res.status(getErrorCode(err)).json({
      success: false,
      message: getErrorMessage(err)
    })
}

function getErrorCode(err) {
  return err.statusCode || httpError.InternalServerError().statusCode;
}

function getErrorMessage(err) {
  return err.message || httpError.InternalServerError().message;
}

module.exports = errorHandler;