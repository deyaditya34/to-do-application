async function requestLogger(req, res, next) {
  const { url, method } = req;

  const timeStampStart = Date.now();

  res.on("close", () => {
    const timeStampEnd = Date.now();
    const responseTime = timeStampEnd - timeStampStart;

    console.log(
      `[api] - ${method} ${url} - ${res.statusCode} - ${responseTime}ms`
    );
  });

  next();
}

module.exports = requestLogger;
