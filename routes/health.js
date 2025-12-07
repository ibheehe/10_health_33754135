const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

// Middleware to protect pages that require login
const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};

//home page
router.get("/", (req, res) => {
    res.render("index"); 
});

//about page
router.get("/about", (req, res) => {
    res.render("about");
});

//search page
router.get("/search", redirectLogin, (req, res) => {
    res.render("search");
});

//search results for specific users.
router.get("/search-result", redirectLogin, (req, res, next) => {
    const keyword = req.query.keyword;

    const sqlquery = `
        SELECT * 
        FROM health_entries 
        WHERE user_id = ? AND (title LIKE ? OR details LIKE ?)
    `;

    db.query(sqlquery, [req.session.userId, `%${keyword}%`, `%${keyword}%`], (err, results) => {
        if (err) return next(err);

        res.render("search_result", {
            results: results,
            keyword: keyword
        });
    });
});

//list for logged in users.
router.get("/list", redirectLogin, (req, res, next) => {
    const sqlquery = "SELECT * FROM health_entries WHERE user_id = ? ORDER BY id DESC";
    db.query(sqlquery, [req.session.userId], (err, results) => {
        if (err) return next(err);

        res.render("list", { entries: results });
    });
});

//entry form
router.get("/add", redirectLogin, (req, res) => {
    res.render("add"); // add.ejs form
});

//post handler
router.post(
    "/add",
    redirectLogin,
    [
        check("title").notEmpty().withMessage("Title is required"),
        check("details").notEmpty().withMessage("Details are required")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render("add", { errors: errors.array() });
        }

        const { title, details } = req.body;

        // Insert with user_id, title, details; date is automatic
        const sqlquery = "INSERT INTO health_entries (user_id, title, details) VALUES (?, ?, ?)";
        db.query(sqlquery, [req.session.userId, title, details], (err, result) => {
            if (err) return next(err);
            res.redirect("/health/list");
        });
    }
);



module.exports = router;
