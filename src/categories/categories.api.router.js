const express = require("express");
const createCategory = require("./create-category.api");
const deleteCategory = require("./delete-category.api");
const getCategory = require("./get-category.api");
const searchCategory = require("./search-category.api");
const updateCategory = require("./update-category.api");

const router = express.Router();

router.post("/create", createCategory);
router.delete("/delete", deleteCategory);
router.get("/get", getCategory);
router.get("/get", searchCategory);
router.put("/update", updateCategory);

module.exports = router;
