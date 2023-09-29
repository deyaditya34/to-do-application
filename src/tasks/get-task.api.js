const httpError = require("http-errors");

const buildApiHander = require("../api-utils/build-api-handler");
const userResolver = require("../middlewares/user-resolver");
const tasksService = require("./tasks.service");

async function controller(req, res) {
  const {id} = req.params;
  const {user} = req.body;

  const result = await tasksService.getTask(id, user.username);

  if (result) {
    res.json({
      message: "Task Found",
      data: result
    })
  } else {
    res.json({
      message: "No Task Found"
    })
  }
}

module.exports = buildApiHander([
  userResolver,
  controller,
]);
