// Desc   this is class about Operational Error
class apiError extends Error {
  constructor (message, code) {
    super(message);
    this.code = code;
    this.status = `${code}`.startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}
module.exports = apiError;
