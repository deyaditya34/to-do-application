const httpError = require("http-errors");
const { scryptSync } = require("crypto");

const config = require("../config");

function  validateUsername(req, res, next) {
  const { username, password } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    throw new httpError.BadRequest("Username and password should be text only");
  }

  if (username.length < 8) {
    throw new httpError.BadRequest("Username must be atleast 8 characters");
  }

  next();
}

function buildUser(username, password) {
  return {
    username: username,
    password: encryptPassword(password),
    role: "user",
  };
}

function encryptPassword(password) {
  return scryptSync(password, config.PASSWORD_SALT, 64).toString("hex");
}

module.exports = {
  validateUsername,
  buildUser,
  encryptPassword,
};
