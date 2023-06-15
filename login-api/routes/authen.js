const express = require("express");
// const path = require("path");
const connection = require("../config");

router = express.Router();

// JWT
var jwt = require('jsonwebtoken');
const accessToken_secret = process.env.ACCESS_TOKEN_SECRET;
const refreshToken_secret = process.env.REFRESH_TOKEN_SECRET;

var bodyParser = require('body-parser'); // ใช้เพื่อให้สามารถจัดการข้อมูลกับ body ที่มากับ request ได้
var jsonParser = bodyParser.json(); // create application/json parser

// authen with acess token API
router.post('/authen', jsonParser, function (req, res, next) {
  try {
    if (req.headers.authorization === undefined) {
      return res.status(401).json({ status: 'error', message: "No Access Token in Authorization Header" });
    }

    // get token from header and split out "Bearer"
    const token = req.headers.authorization.split(' ')[1];

    // verify a token symmetric - synchronous
    var decoded = jwt.verify(token, accessToken_secret);
    connection.execute(
      'SELECT * FROM `users` WHERE email = ?',
      [decoded.email],
      function (err, user, fields) {
        if (err) {
          return res.json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'ok', user });
      });

  } catch (err) {
    if (err.message === 'invalid token') {
      return res.status(403).json({ status: 'forbidden', message: "Access Token Invalid" });
    }
    if (err.message === 'jwt expired') {
      return res.status(401).json({ status: 'error', message: "Access Token Expired" });
    }
    if (err.message === 'invalid signature') {
      return res.status(401).json({ status: 'error', message: "Token is Invalid Signature" });
    }
    res.json({ status: 'error', message: err.message });
  }
});

// refresh token API
router.post('/authen/refresh', jsonParser, function (req, res, next) {
  try {
    if (req.headers.authorization === undefined) {
      return res.status(401).json({ status: 'error', message: "No Refresh Token in Authorization Header" });
    }

    // get token from header
    const token = req.headers.authorization.split(' ')[1];

    // verify a token symmetric - synchronous
    var decoded = jwt.verify(token, refreshToken_secret);
    var access_token = jwt.sign({ email: decoded.email }, accessToken_secret, { expiresIn: '1h', algorithm: "HS256" });
    var refresh_token = jwt.sign({ email: decoded.email }, refreshToken_secret, { expiresIn: '1d', algorithm: "HS256" });

    res.json({ status: 'ok', access_token, refresh_token });

  } catch (err) {
    if (err.message === 'invalid signature') {
      return res.status(401).json({ status: 'error', message: "Token is Invalid Signature" });
    }
    res.json({ status: 'error', message: err.message });
  }
});

exports.router = router;