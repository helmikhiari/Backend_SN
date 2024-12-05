const express = require("express")
const router = express.Router();
const productController=require("../controllers/productController")
const {uploadMiddleware}=require("../middlewares/uploadMiddleware")

router.post("/addProduct",uploadMiddleware.single('image'),productController.addProduct);


module.exports=router