const userController = require("../controllers/userController")
const { jwtMiddleware } = require("../middlewares/authMiddleware");
const express = require("express")
const router = express.Router();

router.post('/register', userController.register);
router.get('/getUser', jwtMiddleware, userController.getUser);


module.exports = router;