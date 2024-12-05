const express = require('express')
const router = express.Router();
const userRoutes = require("./userRoutes")
const authRoutes = require("./authRoutes")
const productRoutes = require("./productRoutes")
router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/product", productRoutes);

module.exports = router;