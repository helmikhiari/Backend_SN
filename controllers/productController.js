const { findByIdAndUpdate } = require('../models/productDetails');
const productService = require('../services/productService')
exports.addProduct = async (req, res) => {
    try {
        const { name, price, gender, description, onSale } = req.body;
        const img = req.file
        const result = await productService.addProduct(name, price, gender, description, onSale, img)
        if (!result)
            return res.status(403).json({ message: "Error while saving Product" })
        return res.status(201).json({ message: "Product Added" })
    } catch (error) {
        console.log("Error is " + error);
    }
}

exports.addProductDetails = async (req, res) => {
    try {
        const { productID, stock, size } = req.body;
        const result = await productService.checkProductExistence(productID);
        if (!result)
            return res.status(404).json({ message: "Product Not Found" })
        const productAdded = await productService.addProductDetails(productID, size, stock)
        if (!productAdded)
            return res.status(403).json({ message: "Ërror while adding Product" })
        return res.status(201).json({ message: "Product Added!" })

    } catch (error) {
        console.log("Error is " + error);
    }
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        return res.send(products);
    }
    catch (error) {
        console.log("Error" + error);
    }
}

exports.deleteProductByID = async (req, res) => {
    try {
        const { ID } = req.params;
        const exist = await productService.checkProductExistence(ID)
        if (!exist) {
            return res.status(404).json({ message: "Product Not Found" })
        }
        const deleted = await productService.deleteProductByID(ID)
        if (!deleted)
            return res.status(403).json({ message: "Can't Delete product , productDetails must be deleted first" })
        return res.status(200).json({ message: "Product Deleted!" })
    } catch (error) {
        console.log('Error is ' + error);
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { ID } = req.params;
        const exist = await productService.checkProductExistence(ID)
        if (!exist) {
            return res.status(404).json({ message: "Product Not Found" })
        }
        const updated = await productService.updateProduct(ID, req.body);
        if (!updated) {
            return res.status(400).json({ message: "Error while updating" });
        }
        return res.status(200).json({ message: "Product Updated!" });
    } catch (error) {
        console.log("Error is " + error);
        return res.status(500).json({ message: error.message });
    }
}