const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:
    {
        type: String,
        required: true
    },
    lastName: String,
    email:
    {
        type: String,
        required: true,
        unique: true,
    },
    password:
    {
        type: String,
        required: true,
    },

    code: String,

    wishList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "product" }
    ],
    cartList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "cart" }
    ],
    orderList: [
        { type: mongoose.Schema.Types.ObjectId, ref: "orderList" }
    ]
}, { versionKey: false, timestamps: true })


module.exports = mongoose.model("user", userSchema);