const express = require("express");

const createTask = require("./create-task.api");
const deleteTask = require("./delete-task.api");
const updateTask = require("./update-task.api");
const taskStatus = require("./task-status-change.api");
const searchTasks = require("./search-task.api");
const getTask = require("./get-task.api");

const router = express.Router();

router.post("/create", createTask);
router.delete("/delete", deleteTask);
router.put("/update", updateTask);
router.put("/status", taskStatus);
router.get("/search", searchTasks);
router.get("/get", getTask);
module.exports = router;
