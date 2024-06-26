const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookie
    if (!token) {
        res.cookie('flash', 'Please log in or register to access this page.', { httpOnly: false });
        return res.redirect('/account/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.userid = decoded.userid;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid token" });
    }
};

module.exports = verifyToken;
