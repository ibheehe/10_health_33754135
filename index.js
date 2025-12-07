// Import modules
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');
const mysql = require('mysql2');

// Create express app
const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));

// Sanitizer
app.use(expressSanitizer());

// Public folder
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(
    session({
        secret: 'somegoldsecret',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 600000 }
    })
);

// EJS
app.set('view engine', 'ejs');

// Application data
app.locals.appData = { appName: "Gold Health" };

// Database
const db = mysql.createPool({
    host: 'localhost',
    user: 'health_app',
    password: 'qwertyuiop',
    database: 'health',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;


// -----------------------------
// ROUTES (ORDER MATTERS)
// -----------------------------

// Main homepage
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

// Users routes (login, register)
const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

// Health routes (list/add/search)
const healthRoutes = require('./routes/health');
app.use('/health', healthRoutes);


// -----------------------------
// START SERVER
// -----------------------------
app.listen(port, () => {
    console.log(`Gold Health app running on http://localhost:${port}`);
});
