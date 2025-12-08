// Get app prefix from environment (VM uses /usr/379, local uses '')
const APP_PREFIX = process.env.APP_PREFIX || '';

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        // Always redirect to the correct login URL
        return res.redirect(`${APP_PREFIX}/users/login`);
    }
    next();
};

module.exports = redirectLogin;
