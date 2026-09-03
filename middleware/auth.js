const jwt = require("jsonwebtoken");

// ==========================
// VERIFY LOGIN (required)
// ==========================
// Blocks the request if the user is not logged in.

function requireLogin(req, res, next) {

    const token = req.cookies.token;

    if (!token) {

        return res.status(401).json({
            message: "Please login to continue."
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Session expired. Please login again."
        });
    }
}


// ==========================
// CHECK LOGIN (optional)
// ==========================
// Does not block the request, just attaches req.user if a valid token exists.

function checkLogin(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return next();
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

    } catch (error) {
        // Invalid/expired token - just continue as a guest
    }

    next();
}

module.exports = {
    requireLogin,
    checkLogin
};
