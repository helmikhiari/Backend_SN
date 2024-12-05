const userService = require('../services/userService');
const authService = require("../services/authService");
const jwtService = require("jsonwebtoken");
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const exist = await userService.checkUserExists(email);
        if (!exist) {
            return res.status(404).json({ message: "user with this email not found" });
        }
        const id = await authService.login(email, password);
        if (!id) {
            return res.status(401).json({ message: "Check ur password" });
        }
        const token = jwtService.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "4h" })
        return res.status(201).json({ token });
    } catch (error) {
        console.log("error" + error)
    }
}