var express = require('express');
var cors = require('cors');
var app = express();

var bodyParser = require('body-parser'); // ใช้เพื่อให้สามารถจัดการข้อมูลกับ body ที่มากับ request ได้
var jsonParser = bodyParser.json(); // create application/json parser

const bcrypt = require('bcrypt');
const saltRounds = 10

require('dotenv').config()

// JWT
var jwt = require('jsonwebtoken');
const secret = 'Fullstack-Login-2023';

// use cors because of to be able to call api across domains
app.use(cors());

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.post('/register', jsonParser, function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var fname = req.body.fname;
    var lname = req.body.lname;

    // Hash password
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            return res.json({ status: 'error hash password', message: err });
        }
        // Store hash password in DB.
        connection.execute(
            'INSERT INTO `users` (email, password, fname, lname) VALUES (?, ?, ?, ?)',
            [email, hash, fname, lname],
            function (err, results, fields) {
                if (err) {
                    return res.json({ status: 'error', message: err });
                }
                res.json({ status: 'ok', user: { email, password: hash, fname, lname } });
            }
        );
    });
});

app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM `users` WHERE email = ?',
        [req.body.email],
        function (err, users, fields) {
            if (err || users == []) {
                return res.json({ status: 'error', message: err });
            }
            if (users.length == 0) {
                res.json({ status: 'error', message: 'No user found' });
            }
            if (users.length == 1) {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, users[0].password, function (err, isLogin) {
                    if (isLogin) {
                        var token = jwt.sign({ email: users[0].email }, secret, { expiresIn: '1h' });
                        res.json({ status: 'ok', message: 'Login Success', token, user: users[0] })
                    } else {
                        res.json({ status: 'error', message: 'Login faild' })
                    }
                });
            }
        }
    );
});

app.post('/authen', jsonParser, function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        // verify a token symmetric - synchronous
        var decoded = jwt.verify(token, secret);
        res.json({ status: 'ok', decoded });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.listen(process.env.PORT, function () {
    console.log(`CORS-enabled web server listening on port ${process.env.PORT}`);
});