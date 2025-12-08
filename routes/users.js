const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const saltRounds = 10;

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('./users/login'); 
    }
    next();
};



//login page
router.get('/login', (req, res) => {
    res.render('login.ejs');
});

//login handler
router.post('/login', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    // gold / smith
    if (username === "gold" && password === "smiths") {
        req.session.userId = 0; 
        return res.render('loggedin.ejs', { message: "Login successful!" });
    }

    const sqlquery = "SELECT id, username, password FROM users WHERE username = ?";
    global.db.query(sqlquery, [username], (err, results) => {
        if (err) return next(err);

        if (results.length === 0) return res.send("Login failed: user not found");

        const hashedPassword = results[0].password;
        bcrypt.compare(password, hashedPassword, (err, match) => {
            if (err) return next(err);

            if (match) {
                // stores users ID.
                req.session.userId = results[0].id;
                res.render('loggedin.ejs', { message: "Login successful!" });
            } else {
                res.send("Login failed: incorrect password");
            }
        });
    });
});

// logout
router.get('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) return res.redirect('./'); // relative path
        res.redirect('./');  // relative redirect to home
    });
});

//register page
router.get('/register', (req, res) => {
    res.render('register.ejs');
});

//registered handler
router.post('/registered',
    [
        check('username').isLength({ min: 5, max: 20 }).withMessage('Username must be 5-20 characters'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
        check('email').isEmail().withMessage('Enter a valid email')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('register.ejs', { errors: errors.array() });
        }

        const username = req.sanitize(req.body.username);
        const email = req.sanitize(req.body.email);
        const password = req.body.password;

        // Hash the password
        bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if (err) return next(err);

            const sql = "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
            const values = [username, hashedPassword, email];

            global.db.query(sql, values, (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.render('register.ejs', { errors: [{ msg: 'Username or email already exists' }] });
                    }
                    return next(err);
                }

                // Registration success
                res.send(`User ${username} registered successfully! <a href="./login">Login here</a>`); // relative path
            });
        });
    }
);

module.exports = router;
