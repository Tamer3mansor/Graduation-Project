const Express = require("express");
const rateLimit = require("express-rate-limit");
const db = require("./connectTodb/db");
const app = Express();
const morgan = require("morgan");
const userRoutes = require("./Routes/routes");
const notfound = require("./MiddleWares/NotFound");
const globalError = require("./MiddleWares/globalError");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
// const csrf = require("express-csrf");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
require("dotenv").config();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(Express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(Express.json({ limit: "10kb" }));
app.use(hpp());
// app.use(csrf.check());
app.use("/api/v1/user/upload", Express.static("upload"));
app.use("/api/v1/user", userRoutes);
app.all("*", notfound);
app.use(globalError);
let server = 0;
db.connect(process.env.uri)
  .then(() => {
    server = app.listen(process.env.port || 3000, () => {
      console.log(`app listen at port ${process.env.port || 3000}`);
    });
  })
  .catch((error) => {
    console.log(`there are problem ${error}`);
  });
// Handel error out express <async code>
process.on("unhandledRejection", (error) => {
  console.error(`unhandledRejection Error ${error.name}`);
  server.close(() => {
    process.exit(1);
  });
});
