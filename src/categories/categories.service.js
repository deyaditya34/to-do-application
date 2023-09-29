const database = require("../services/database.service");
const config = require("../config");
const { ObjectId } = require("mongodb");

function createCategory(categoryDetails) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .insertOne(categoryDetails);
}

function searchCategory(categoryDetails, pageNo, pageSize) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .find(categoryDetails)
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize)
    .toArray();
}

function getCategory(id) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .findOne({ _id: new ObjectId(id) });
}

function getCategoryByName(categoryName) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .findOne({categoryName: categoryName})
}

function deleteCategory(id) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .deleteOne({ _id: new ObjectId(id) });
}

function updateCategory(categoryId, categoryDetails) {
  return database
    .getCollection(config.COLLECTION_NAMES.CATEGORIES)
    .updateOne({ _id: new ObjectId(categoryId) }, { $set: categoryDetails });
}

module.exports = {
  createCategory,
  getCategory,
  searchCategory,
  deleteCategory,
  updateCategory,
  getCategoryByName
};
