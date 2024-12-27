const userService = require('../services/userService');
const authService = require("../services/authService");
const jwtService = require("jsonwebtoken");
const { sendMail } = require("../Node Mailer/transporter")
const uuid = require("uuid")
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

exports.forgetPassword = async (req, res) => {
    try {
        const exist = await userService.checkUserExists(req.body.email);
        if (!exist)
            return res.status(404).json({ message: "'User with this mail does not exist" })
        const code = uuid.v4();
        const updated = userService.updateUser(req.body.email, "code", code)
        if (!updated) {
            return res.status(400).json({ message: "Error occured" });
        }
        const tokenForgetPassword = jwtService.sign({ code, email: req.body.email }, process.env.FP_SECRET_KEY, { expiresIn: "4h" });
        console.log(tokenForgetPassword)
        await sendMail(req.body.email, tokenForgetPassword)
        return res.status(201).json({ message: "Check ur email" });
    } catch (error) {
        console.log("Error is " + error);
    }
}
    
exports.resetPassword = async (req, res) => {
    try {
        const { code, email } = req.user;
        const { newPassword } = req.body;
        const match = await authService.matchPassword(email, newPassword)
        if (match) {
            return res.status(409).json({ message: "New password can't be the same as the old password" });
        }
        const codeIsTrue = await authService.checkCode(email, code)
        if (!codeIsTrue) {
            return res.status(403).json({ message: "Invalid Code " })
        }
        const updated = await authService.changePassword(email, newPassword)
        if (!updated) {
            return res.status(400).json({ message: "Error occured" })
        }
        return res.status(200).json({ message: "Password Updated Successfully" })
    } catch (error) {

    }
}

