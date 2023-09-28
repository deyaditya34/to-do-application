const httpError = require("http-errors");

const createParamsValidator = (params, paramsKey) => (req, res, next) => {
  const reqParams = Reflect.get(req, paramsKey);

  const missingParams = params.filter(
    (param) => !Reflect.has(reqParams, param)
  );

  if (missingParams.length > 0) {
    throw new httpError.BadRequest(
      `Required field '${missingParams.join(
        ","
      )}' are missing from '${paramsKey}'`
    );
  }

  next();
};

const PARAM_KEY = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
};

module.exports = { createParamsValidator, PARAM_KEY };
