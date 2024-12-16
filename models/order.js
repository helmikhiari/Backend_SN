const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    productDetailsID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productDetails"
    },
    orderListID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderList"
    },
    quantity:
    {
        type: Number,
        required: true
    },
}, { timestamps: false, versionKey: false }
)

module.exports = mongoose.model("order", orderSchema);
