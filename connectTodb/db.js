const mongoose = require("mongoose");
require("dotenv").config();
const connect = (dbURI) => {
  mongoose.set("strictQuery", true);
  return mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};
module.exports = { connect };
