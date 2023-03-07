const Express = require("Express");
const db = require("./connectTodb/db");
const app = Express();
const morgan = require("morgan");
const userRoutes = require("./Routes/routes");
const notfound = require("./MiddleWares/NotFound");
const globalError = require("./MiddleWares/globalError");
const cookieParser = require("cookie-parser");
require("dotenv").config();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(Express.json());
app.use("/api/v1/user/upload", Express.static("upload"));
app.use("/api/v1/user", userRoutes);
app.all("*", notfound);
app.use(globalError);
let server = 0;
db.connect(process.env.uri).then(() => {
  server = app.listen(process.env.port || 3000, () => { console.log(`app listen at port ${process.env.port || 3000}`); });
}).catch((error) => {
  console.log(`there are problem ${error}`);
});
// Handel error out express <async code>
process.on("unhandledRejection", (error) => {
  console.error(`unhandledRejection Error ${error.name}`);
  server.close(() => {
    process.exit(1);
  });
});
