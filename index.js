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


app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: 'somegoldsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }
}));


app.set('view engine', 'ejs');

// Application data
app.locals.appData = { appName: "Gold Health" };

//database
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

//routes
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const healthRoutes = require('./routes/health');
app.use('/health', healthRoutes);

//start server on port 8000
app.listen(port, () => {
    console.log(`Gold Health app running on port ${port}!`);
});
