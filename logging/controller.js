const { format, createLogger, transports } = require("winston");

const { combine, timestamp, label, printf } = format;
const CATEGORY = "winston custom format";

// Using the printf format.
const customFormat = printf(({ level, message, label, timestamp }) => {
  message = message.obj ? JSON.stringify(message.obj) : message;
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logs/example.log"
    })
  ]
});

module.exports = logger;
