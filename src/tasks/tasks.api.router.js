const express = require("express");

const createTask = require("./create-task.api");
const deleteTask = require("./delete-task.api");
const updateTask = require("./update-task.api");
const taskStatus = require("./task-status-change.api");
const searchTasks = require("./search-task.api");
const getTask = require("./get-task.api");

const router = express.Router();

router.post("/", createTask);
router.get("/:id", getTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);
router.put("/:id/:newStatus", taskStatus);
router.get("/", searchTasks);
module.exports = router;
