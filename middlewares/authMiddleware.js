//Check if the user is authenticated
const validateAuth = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/auth/login');
    }
};

module.exports = validateAuth;