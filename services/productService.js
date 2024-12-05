const productModel = require("../models/product")
exports.addProduct = async (name, price, gender, description, onSale, img) => {
    try {
        console.log(img)
        const imgPath = `${process.env.BASE_URL}/uploads/${img.filename}`
        const newProduct = new productModel({ name, price, gender, description, onSale, image: imgPath })
        await newProduct.save();
        return true;
    } catch (error) {
        console.log("Error is " + error)
        return false;
    }
}