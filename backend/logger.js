const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, meta }) => {
      const { req, res } = meta || {};
      const statusCode = res ? res.statusCode : "-";
      const userAgent = req ? req.headers["user-agent"] : "-";
      const remoteAddress = req ? req.ip : "-";

      return `${timestamp} ${level}: ${message} - Status: ${statusCode}, User Agent: ${userAgent}, Remote Address: ${remoteAddress}`;
    }),
    winston.format.json() // Keep the logs in JSON format
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
