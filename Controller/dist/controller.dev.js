"use strict";

/* eslint-disable new-cap */
// const app = require("express")();
// const http = require("http").Server(app);
// const io = require("socket.io")(http);
var userModel = require("../models/user");

var asyncHandler = require("express-async-handler");

var apiError = require("../utils/apiError");

var jwt = require("jsonwebtoken");

var log = require("../logging/controller");

var createToken = function createToken(id) {
  return jwt.sign({
    id: id
  }, "secret", {
    expiresIn: 4 * 24 * 60 * 60
  });
};

var getUsers = asyncHandler(function _callee(req, res, next) {
  var allUsers;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(userModel.find({}));

        case 2:
          allUsers = _context.sent;

          if (!allUsers) {
            _context.next = 8;
            break;
          }

          log.info("Accepted getUsers Operation");
          res.status(200).send(allUsers);
          _context.next = 10;
          break;

        case 8:
          log.error("Error : Not Found Error");
          return _context.abrupt("return", next(new apiError("Not found", 400)));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
});
var createUser = asyncHandler(function _callee2(req, res, next) {
  var _req$body, email, password, level, score, image, user, token, message;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, password = _req$body.password;
          level = req.body.level || "000";
          score = req.body.score || "000";
          image = req.file.path;
          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(userModel.create({
            email: email,
            password: password,
            level: level,
            score: score,
            image: image
          }));

        case 7:
          user = _context2.sent;
          token = createToken(user._id);

          if (user) {
            log.info("Success Create user operation");
            res.cookie("userjwt", token, {
              httpOnly: true,
              maxAge: 3 * 24 * 60 * 60 * 1000
            });
            res.status(201).json({
              data: user
            });
          }

          _context2.next = 18;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](4);
          message = "";

          if (_context2.t0.code === 11000) {
            message += "This email already in dataBase<".concat(_context2.t0.name, ">");
          } else message += "Error while trying to create try agin <".concat(_context2.t0.name, ">"); // eslint-disable-next-line new-cap


          log.error({
            message: message
          });
          next(new apiError(message), _context2.t0.code);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 12]]);
});
var getSpecificUser = asyncHandler(function _callee3(req, res, next) {
  var _req$body2, email, password, user, token;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context3.next = 3;
          return regeneratorRuntime.awrap(userModel.loginAuth(email, password));

        case 3:
          user = _context3.sent;
          console.log(user, user._id);

          if (user) {
            token = createToken(email, password);
            res.cookie("userjwt", token, {
              httpOnly: true,
              maxAge: 3 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
              user: user
            });
            log.info("Success get user operation");
          } else {
            log.error("No User Found with this email");
            next(new apiError("No User Found with this email"), 400);
          }

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
});
var deleteUser = asyncHandler(function _callee4(req, res, next) {
  var _req$body3, email, password, user, id, deleted;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, password = _req$body3.password;
          _context4.next = 3;
          return regeneratorRuntime.awrap(userModel.loginAuth(email, password));

        case 3:
          user = _context4.sent;

          if (!user) {
            _context4.next = 13;
            break;
          }

          id = user._id;
          _context4.next = 8;
          return regeneratorRuntime.awrap(userModel.findByIdAndDelete(id));

        case 8:
          deleted = _context4.sent;
          if (deleted) res.status(200).json({
            deleted: deleted
          });
          log.info("Success delete operation");
          _context4.next = 15;
          break;

        case 13:
          next(new apiError("No User Found with this id"), 400);
          log.error("No User Found with this email");

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  });
});
var updateUser = asyncHandler(function _callee5(req, res, next) {
  var id, email, password, level, score, user, updated;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.params.id;
          email = req.body.email;
          password = req.body.password;
          level = req.body.level || "000";
          score = req.body.score || 0;
          _context5.next = 7;
          return regeneratorRuntime.awrap(userModel.loginAuth(email, password));

        case 7:
          user = _context5.sent;

          if (!user) {
            _context5.next = 16;
            break;
          }

          _context5.next = 11;
          return regeneratorRuntime.awrap(userModel.findByIdAndUpdate({
            _id: id
          }, {
            email: email,
            password: password,
            level: level,
            score: score
          }, {
            "new": true
          }));

        case 11:
          updated = _context5.sent;
          if (updated) res.status(200).json({
            user: user
          });
          log.info("Success update");
          _context5.next = 18;
          break;

        case 16:
          next(new apiError("No User Found with this id"), 400);
          log.error("No User Found with this id/email");

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  });
});

var logOut = function logOut(req, res) {
  res.cookie("userjwt", " ", {
    maxAge: 1
  });
  res.redirect("/");
}; // This section to add deepSpeech(send , receive);
// const deepSpeech = (req, res) => {
//   io.on("connection", socket => {
//     // emit to get record from front
//     socket.on("toDeep", record => {
//     // Function to send to model
//     });
//   });
// };


module.exports = {
  getUsers: getUsers,
  createUser: createUser,
  getSpecificUser: getSpecificUser,
  deleteUser: deleteUser,
  updateUser: updateUser,
  logOut: logOut
};