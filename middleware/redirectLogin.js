module.exports = function redirectLogin(req, res, next) {
    const APP_PREFIX = process.env.APP_PREFIX || ""; 
    if (!req.session.userId) {
        return res.redirect(`${APP_PREFIX}/users/login`);
    }
    next();
};
