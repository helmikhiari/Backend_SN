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