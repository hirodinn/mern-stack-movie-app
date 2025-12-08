import logger from "../logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
}
