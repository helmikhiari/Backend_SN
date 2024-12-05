const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:
    {
        type: String,
        required: true,
        unique: true
    },

    description: String,

    price:
    {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ["women", "men", "kids"]
    },
    image:
    {
        type: String,
        required: true,
    },
    onSale:
    {
        type: Number,
        default: 1
    },
    productDetails:
        [
            { type: mongoose.Schema.Types.ObjectId, ref: "productDetails" }
        ]
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model("product", productSchema);