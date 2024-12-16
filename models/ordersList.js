const mongoose = require("mongoose")

const ordersListSchema = new mongoose.Schema({
    userID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order"
        }
    ],

    totalPrice: Number

}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("orderList", ordersListSchema);