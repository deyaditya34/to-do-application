const MONGOURL = "mongodb://127.0.0.1:27017";
const DB_NAME = "to-do-app";

const APP_PORT = 3000;

const COLLECTION_NAMES = {
  USERS: "application-users",
  CATEGORIES: "categories",
  TASKS: "tasks"
};

const JWT_SECRET = "Bokakhat@123";

const AUTH_TOKEN_HEADER_FIELD = "token";

const PASSWORD_SALT = "Bokakhat@123";

module.exports = {
  MONGOURL,
  DB_NAME,
  APP_PORT,
  COLLECTION_NAMES,
  JWT_SECRET,
  AUTH_TOKEN_HEADER_FIELD,
  PASSWORD_SALT,
};
