const database = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

function createTask(taskDetails) {
  return database
    .getCollection(config.COLLECTION_NAMES.TASKS)
    .insertOne(taskDetails);
}

function deleteTask(taskId) {
  return database
    .getCollection(config.COLLECTION_NAMES.TASKS)
    .deleteOne({ _id: new ObjectId(taskId) });
}

function getTask(taskId, username) {
  return database
    .getCollection(config.COLLECTION_NAMES.TASKS)
    .findOne({ _id: new ObjectId(taskId), createdBy: { $eq: username } });
}

function updateTask(taskId, updateDetails) {
  return database
    .getCollection(config.COLLECTION_NAMES.TASKS)
    .updateOne({ _id: new ObjectId(taskId) }, { $set: updateDetails });
}

function searchTask(taskDetails, username, pageNo, pageSize) {
  return database
    .getCollection(config.COLLECTION_NAMES.TASKS)
    .find({
      ...taskDetails,
      createdBy: {
        $eq: username,
      },
    })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .toArray();
}

module.exports = {
  createTask,
  deleteTask,
  getTask,
  updateTask,
  searchTask,
};
