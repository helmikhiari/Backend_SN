const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema(
    {
        productDetailsID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "productDetails"
        },
        userID:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        quantity:
        {
            type: Number,
            required: true
        },
    }, { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("cart", cartSchema);