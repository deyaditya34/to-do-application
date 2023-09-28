const httpError = require("http-errors");
const config = require("../config");
const jwtService = require("../services/jwt.service");
const database = require("../services/database.service");
const authUtils = require("./auth.utils");

async function register(username, password) {
  const existingUser = await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .findOne({ username });
  
  if (existingUser) {
    throw new httpError.UnprocessableEntity(`${username} is already taken`);
  }

  const userDetails = authUtils.buildUser(username, password);

  await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .insertOne(userDetails);
}

async function login(username, password) {
  const user = await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .findOne({
      username: username,
      password: authUtils.encryptPassword(password),
    });

  if (!user) {
    throw new httpError.Unauthorized("Username/Pasword combo incorrect");
  }

  const token = jwtService.createToken({ username });

  return token;
}

async function getUserFromToken(token) {
  const payload = jwtService.decodeToken(token);

  if (!payload) {
    return null;
  }

  const username = payload.username;

  const user = await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .findOne(
      { username },
      { projection: { _id: false, password: false } }
    );
  console.log("user -", user)    
  return user;
}

async function findUsers(criteria) {
  return await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .find(criteria)
    .toArray();
}

async function changePassword(userDetails, username, password, newPassword) {
  
  const existingUser = await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .findOne({
      username: userDetails.username,
      password: authUtils.encryptPassword(password),
    });

  if (!user) {
    throw new httpError.BadRequest("Username/Password combo incorrect");
  }

  if (userDetails.username !== username) {
    throw new httpError.BadRequest("Username provided does not match with the username stored in the database")
  }

  let updatedUser = buildUser(username, newPassword)
  ;

  await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .updateOne({ username }, { $set: { password: updatedUser.password } });
}

async function retrieveUserDetails(username) {
  return await database
    .getCollection(config.COLLECTION_NAMES.USERS)
    .findOne({ username: username });
}

module.exports = {
  register,
  login,
  getUserFromToken,
  findUsers,
  changePassword,
  retrieveUserDetails
}
