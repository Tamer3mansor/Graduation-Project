const Express = require("Express");
const db = require("./connectTodb/db");
const app = Express();
const morgan = require("morgan");
const userRoutes = require("./Routes/routes");
const notfound = require("./MiddleWares/NotFound");
const globalError = require("./MiddleWares/globalError");
require("dotenv").config();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(Express.json());
app.use("/api/v1/user", userRoutes);
app.all("*", notfound);
app.use(globalError);
const start = () => {
  db.connect(process.env.uri).then(() => {
    app.listen(process.env.port || 3000, () => { console.log(`app listen at port ${process.env.port || 3000}`); });
  }).catch((error) => {
    console.log(`there are problem ${error}`);
  });
};
start();
