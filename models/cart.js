const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        productDetailsID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productDetails"
        },
        cartListID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cartList"
        },
        quantity:
        {
            type: Number,
            required: true
        },
    }, { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("cart", cartSchema);