const mongoose = require("mongoose");

const productDetailsSchema = new mongoose.Schema({
    size: Number,

    stock: Number,
    
    productID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    }
}, { timestamps: true, versionKey: false })


module.exports = mongoose.model("productDetails", productDetailsSchema);