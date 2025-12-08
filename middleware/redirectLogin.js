module.exports = function redirectLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/users/login');  // Always correct
    }
    next();
};
