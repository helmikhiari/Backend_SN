const mongoose = require("mongoose")

const cartListSchema = new mongoose.Schema({
    userID:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    carts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cart"
        }
    ]

}, { timestamps: true, versionKey: false })

module.exports = mongoose.model("cartList", cartListSchema);