const jwtService = require('jsonwebtoken')

exports.jwtMiddleware = async (req, res, next) => {
    try {

        const token = req.headers?.authorization?.split(" ")[1]
        console.log("token");
        if (!token) {
            return res.status(401).json({ message: "no token provided" });
        }
        const decodedJwt = jwtService.verify(token, process.env.JWT_SECRET_KEY)
        req.userID = decodedJwt.id;
        next();
    }
    catch (error) {

        return res.status(401).send(error.message);
    }
}
exports.resetPasswordMiddleware = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "no token provided for forget password" });
        }
        const decodedToken = jwtService.verify(token, process.env.FP_SECRET_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).send(error.message);
    }
}