const productModel = require("../models/product")
const productDetailsModel = require("../models/productDetails");
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

exports.checkProductExistence = async (productID) => {
    try {
        const product = await productModel.findById(productID)
        return !!product;
    } catch (error) {
        console.log("Error " + error)
        return false;
    }
}

exports.addProductDetails = async (productID, size, stock) => {
    try {
        const productDetails = await productDetailsModel.findOne({ productID, size });
        if (productDetails) {
            productDetails.stock += stock;
            await productDetails.save();
            return true;
        }
        else {
            const product = await productModel.findById(productID)
            const newProductDetails = new productDetailsModel({ size, stock, productID: product })
            await newProductDetails.save()
            product.productDetails.push(newProductDetails);
            await product.save()
            return true;

        }
    }
    catch (error) {
        console.log('Error is ' + error)
        return false;
    }
}

exports.getAllProducts = async () => {
    try {
        const products = await productModel.find().select(' -createdAt -updatedAt').populate({ path: "productDetails", select: "size stock _id" })
        return products;
    } catch (error) {
        console.log("error " + error)
        return false
    }
}

exports.deleteProductByID = async (id) => {
    try {
        const product = await productModel.findById(id)
        if (product.productDetails.length != 0)
            return false;
        await product.deleteOne();
        return true;
    } catch (error) {
        console.log('Error' + error)
        return false;
    }
}

exports.updateProduct = async (ID, dataToUpdate) => {
    try {
        const updatedData = await productModel.findByIdAndUpdate(ID, dataToUpdate, { new: true })
        return !!updatedData
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}