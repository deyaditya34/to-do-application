const express = require("express");
const createCategory = require("./create-category.api");
const deleteCategory = require("./delete-category.api");
const getCategory = require("./get-category.api");
const searchCategory = require("./search-category.api");
const updateCategory = require("./update-category.api");

const router = express.Router();

router.post("/", createCategory);
router.get("/", searchCategory);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

