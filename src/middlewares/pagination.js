const httpError = require("http-errors");

function pagination(req, res, next) {
  const { pageNo, pageSize } = req.query;

  if (pageNo) {
    let pageNumber = parseInt(pageNo);

    if (Number.isNaN(pageNumber) === true) {
      throw new httpError.BadRequest(
        "Page Number should consist of only numbers"
      );
    }

    if (pageNumber < 1) {
      throw new httpError.BadRequest("Page Number should be greater '0'");
    }

    Reflect.set(req.query, "pageNo", pageNumber);
  }

  if (pageSize) {
    let pageSz = parseInt(pageSize);

    if (Number.isNaN(pageSz === true)) {
      throw new httpError.BadRequest(
        "Page Size should consist of only numbers"
      );
    }

    if (pageSz > 20) {
      throw new httpError.BadRequest("Page size should be less than 20");
    }

    Reflect.set(req.query, "pageSize", pageSz);
  }

  if (!pageNo) {
    Reflect.set(req.query, "pageNo", 1);
  }

  if (!pageSize) {
    Reflect.set(req.query, "pageSize", 10);
  }

  next();
}

module.exports = pagination;
