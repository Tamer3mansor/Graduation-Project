const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const checkToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "tamer secret", async (err, token) => {
      if (err) {
        // return to login page
        // res.locals.user = null;
        next();
      } else {
        // eslint-disable-next-line no-unused-vars
        const user = await userModel.findById(token.id);
        // print user name on screen
        // res.locals.user = user;
        next();
      }
    });
  } else {
    // res.locals.user = null;
    // return to login page
    next();
  }
};
module.exports = checkToken;
