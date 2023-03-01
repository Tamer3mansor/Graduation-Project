/* eslint-disable no-unused-vars */
const globalError = (err, req, res, next) => {
  err.code = err.code || 500;
  err.Status = err.status || "error";
  if (process.env.NODE_ENV === "development") { devError(err, res); } else { productError(err, res); }
};
const devError = (err, res) => {
  return res.status(err.code).json({
    Status: err.Status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const productError = (err, res) => {
  return res.status(err.code).json({
    Status: err.Status,
    message: err.message
  });
};
module.exports = globalError;
