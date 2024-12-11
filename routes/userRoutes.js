const userController = require("../controllers/userController")
const { jwtMiddleware } = require("../middlewares/authMiddleware");
const express = require("express")
const router = express.Router();

router.post('/register', userController.register);
router.get('/getUser', jwtMiddleware, userController.getUser);
router.put('/updateUser', jwtMiddleware, userController.updateUser);
router.put('/changePassword', jwtMiddleware, userController.changePassword);
router.post('/addToCart', jwtMiddleware, userController.addToCart)
router.delete('/deleteFromCart/:cartID', jwtMiddleware, userController.deleteFromCart);
router.put('/updateCart', jwtMiddleware, userController.updateCart)
router.patch('/toggleProduct', jwtMiddleware, userController.toggleWishList);
router.post('/purchase', jwtMiddleware, userController.purchase);
module.exports = router;