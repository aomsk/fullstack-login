const express = require("express");
// const path = require("path");
const connection = require("../config");

router = express.Router();

// JWT
var jwt = require('jsonwebtoken');
const accessToken_secret = process.env.ACCESS_TOKEN_SECRET;
const refreshToken_secret = process.env.REFRESH_TOKEN_SECRET;

// bcrypt
const bcrypt = require('bcrypt');

var bodyParser = require('body-parser'); // ใช้เพื่อให้สามารถจัดการข้อมูลกับ body ที่มากับ request ได้
var jsonParser = bodyParser.json(); // create application/json parser

// Login API
router.post('/login', jsonParser, function (req, res, next) {
  try {
    if (req.body.email === '' || req.body.password === '') {
      return res.status(400).json({ status: 'error', message: "Missing username and/or password" });
    }
    connection.execute(
      'SELECT * FROM `users` WHERE email = ?',
      [req.body.email],
      function (err, users, fields) {
        if (err || users == []) {
          return res.json({ status: 'error', message: err });
        }
        if (users.length == 0) {
          return res.json({ status: 'error', message: 'No user found' });
        }
        if (users.length == 1) {
          // Load hash from your password DB.
          bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
            if (isLogin) {
              var access_token = jwt.sign({ email: users[0].email }, accessToken_secret, { expiresIn: '1h', algorithm: "HS256" });
              var refresh_token = jwt.sign({ email: users[0].email }, refreshToken_secret, { expiresIn: '1d', algorithm: "HS256" });
              // res.json({ status: 'ok', message: 'Login Success', token, user: users[0] })
              res.json({ status: 'ok', message: 'Login Success', access_token, refresh_token })
            } else {
              res.status(401).json({ status: 'error', message: 'Login faild username and/or password invalid' })
            }
          });
        }
      }
    );
  } catch (err) {
    res.json({ status: 'error', message: err.message });
  }
});

exports.router = router;