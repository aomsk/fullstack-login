const express = require("express");
// const path = require("path");
const connection = require("../config");

router = express.Router();

// bcrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;

var bodyParser = require("body-parser"); // ใช้เพื่อให้สามารถจัดการข้อมูลกับ body ที่มากับ request ได้
var jsonParser = bodyParser.json(); // create application/json parser

// register API
router.post("/register", jsonParser, function (req, res, next) {
  try {
    var email = req.body.email;
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;

    if (email === "" || password === "" || fname === "" || lname === "") {
      return res.status(400).json({ status: "error", message: "Missing fields (fname, lname, email, and/or password)" });
    }

    connection.execute("SELECT * FROM `users` WHERE email = ?", [req.body.email], function (err, users, fields) {
      if (err || users == []) {
        return res.json({ status: "error", message: err });
      }
      if (users.length == 1) {
        res.status(400).json({ status: "error", message: "User is already exists Please Log In" });
      }
      if (users.length == 0) {
        bcrypt.hash(password, saltRounds, function (err, hash) {
          if (err) {
            return res.json({ status: "error hash password", message: err });
          }
          // Store hash password in DB.
          connection.execute("INSERT INTO `users` (email, password, fname, lname) VALUES (?, ?, ?, ?)", [email, hash, fname, lname], function (err, results, fields) {
            if (err) {
              return res.json({ status: "error", message: err });
            }
            res.json({ status: "ok", user: { email, password: hash, fname, lname } });
          });
        });
      }
    });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

exports.router = router;
