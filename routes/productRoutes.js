const express = require("express")
const router = express.Router();
const productController = require("../controllers/productController")
const { uploadMiddleware } = require("../middlewares/uploadMiddleware")

router.post("/addProduct", uploadMiddleware.single('image'), productController.addProduct);
router.post("/addProductDetails", productController.addProductDetails);
router.get('/getAllProducts',productController.getAllProducts);
router.delete("/deleteProduct/:ID",productController.deleteProductByID)
module.exports = router