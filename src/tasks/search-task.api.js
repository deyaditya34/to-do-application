const httpError = require("http-errors");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs(customParseFormat);

const buildApiHandler = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const tasksService = require("./tasks.service");
const pagination = require("../middlewares/pagination");

async function controller(req, res) {
  const { searchCriterias, pageNo, pageSize } = req.query;
  const { user } = req.body;

  const result = await tasksService.searchTask(
    searchCriterias,
    user.username,
    pageNo,
    pageSize
  );

  res.json({
    message: "search results",
    data: result,
  });
}

async function validateParams(req, res, next) {
  const { title, description, categoryId, dueDate, status } = req.query;
  const parsedSearchCriteria = {};

  if (title) {
    parsedSearchCriteria["title"] = title;
  }

  if (description) {
    parsedSearchCriteria["description"] = description;
  }

  if (dueDate) {
    if (!dayjs(dueDate, "YYYY-MM-DD").isValid()) {
      throw new httpError.BadRequest(
        `Field dueDate - '${dueDate}' is invalid. It should be in 'YYYY-MM-DD' format.`
      );
    }
    parsedSearchCriteria["dueDate"] = dayjs(dueDate, "YYYY-MM-DD").format();
  }

  if (categoryId) {
    parsedTaskDetails["categoryId"] = categoryId;
  }

  if (status) {
    parsedTaskDetails["status"] = status;
  }

  Reflect.set(req.query, "searchCriterias", parsedSearchCriteria);
  next();
}

module.exports = buildApiHandler([
  userResolver,
  validateParams,
  pagination,
  controller,
]);
