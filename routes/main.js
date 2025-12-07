// Create a new router
const express = require("express");
const router = express.Router();

//home page
router.get('/', function(req, res, next) {
    res.render('index.ejs');  
});

//about page
router.get('/about', function(req, res, next) {
    res.render('about.ejs');
});

//search form
router.get('/search', function(req, res, next) {
    res.render('search.ejs');
});

//serach results
router.get('/search/results', function(req, res, next) {
    const keyword = req.query.keyword;

    // Search in the health_log table (mood, note)
    const sqlquery = `
        SELECT steps, mood, note, date 
        FROM health_log 
        WHERE mood LIKE ? OR note LIKE ?
    `;

    db.query(sqlquery, [`%${keyword}%`, `%${keyword}%`], (err, result) => {
        if (err) return next(err);

        res.render('search_result.ejs', {
            entries: result,
            keyword: keyword
        });
    });
});

//login page
router.get('/login', function(req, res, next) {
    res.render('login.ejs');
});

// Export router
module.exports = router;
