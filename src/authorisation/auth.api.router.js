const express = require("express");

const loginUser = require("./auth.login.api");
const registerUser = require("./auth.register.api");
const passwordChangeUser = require("./password.change.api");
const queryUsers = require("./query.users.api");

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/changePassword", passwordChangeUser);
router.get("/queryUsers", queryUsers);

module.exports = router;