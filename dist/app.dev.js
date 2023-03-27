"use strict";

var Express = require("Express");

var db = require("./connectTodb/db");

var app = Express();

var morgan = require("morgan");

var userRoutes = require("./Routes/routes");

var notfound = require("./MiddleWares/NotFound");

var globalError = require("./MiddleWares/globalError");

var cookieParser = require("cookie-parser");

var mongoSanitize = require("express-mongo-sanitize");

var hpp = require("hpp");

var csrf = require("express-csrf");

require("dotenv").config();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(Express.urlencoded({
  extended: true
}));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(Express.json({
  limit: "10kb"
}));
app.use(hpp()); // app.use(csrf.check());

app.use("/api/v1/user/upload", Express["static"]("upload"));
app.use("/api/v1/user", userRoutes);
app.all("*", notfound);
app.use(globalError);
var server = 0;
db.connect(process.env.uri).then(function () {
  server = app.listen(process.env.port || 3000, function () {
    console.log("app listen at port ".concat(process.env.port || 3000));
  });
})["catch"](function (error) {
  console.log("there are problem ".concat(error));
}); // Handel error out express <async code>

process.on("unhandledRejection", function (error) {
  console.error("unhandledRejection Error ".concat(error.name));
  server.close(function () {
    process.exit(1);
  });
});