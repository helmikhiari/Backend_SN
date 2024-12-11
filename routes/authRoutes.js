const express = require("express")
const router = express.Router();
const authController = require("../controllers/authController");
const { jwtMiddleware, resetPasswordMiddleware } = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/forgetPassword", authController.forgetPassword)
router.post("/resetPassword", resetPasswordMiddleware, authController.resetPassword)
module.exports = router;