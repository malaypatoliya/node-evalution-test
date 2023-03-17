const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    let success = false;
    const token = req.header('token');
    if (!token) {
        res.status(401).send({ success: success, errMsg: "Please authenticate using a valid token" });
    }
    try {
        const { userId } = jwt.verify(token, process.env.SECRET_KEY);
        if (userId) {
            req.id = userId;
        }
        else {
            res.status(401).json({ success: success, errMsg: "Login with valid token" });
        }
        next();
    } catch (err) {
        res.status(500).json({ success: success, errMsg: "Internal server error" });
    }
}

module.exports = validateToken;