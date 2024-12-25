const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const cartModel = require("../models/cart");
const orderListModel = require("../models/ordersList");
const orderModel = require("../models/order");
const cart = require("../models/cart");
const productDetailsModel = require("../models/productDetails")
exports.checkUserExists = async (email) => {
    try {
        const user = await userModel.findOne({ email });
        return !!user;
    } catch (error) {
        console.log("error " + error);
        return false;
    }
}


exports.register = async (email, lastName, firstName, password) => {
    try {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = new userModel({ email, firstName, lastName, password: hashedPassword });
        await newUser.save();
        return true;
    } catch (error) {
        console.log("error " + error);
        return false;
    }
}

exports.getUserByID = async (userID) => {
    try {
        const user = await userModel.findById(userID).select("firstName lastName email cartList wishList orderList")
            .populate({ path: "cartList", select: "quantity productDetailsID" }).
            populate({ path: "orderList", select: "totalPrice createdAt", populate: { path: "orders", select: "quantity productDetailsID" } })
        return user;
    } catch (error) {
        console.log("error is " + error)
        return false;
    }
}

exports.updateUser = async (userID, dataToUpdate) => {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userID, dataToUpdate);
        return !!updatedUser
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}

exports.checkOldPassword = async (userID, password) => {
    try {
        const user = await userModel.findById(userID);
        return bcrypt.compareSync(password, user.password);
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}

exports.changePassword = async (userID, newPassword) => {
    try {
        const salt = bcrypt.genSaltSync();
        console.log(salt);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        const updatedUser = await userModel.findByIdAndUpdate(userID, { password: hashedPassword });
        return !!updatedUser
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}

exports.addToCart = async (userID, productDetailsID, quantity) => {
    try {
        // const cart = await cartModel.findOne({ productDetailsID, userID });
        // if (cart) {
        //     cart.quantity += quantity;
        //     await cart.save();
        // }
        // else {
        const user = await userModel.findById(userID);
        const newCart = new cartModel({ productDetailsID, quantity, userID: user });
        user.cartList.push(newCart);
        await user.save();
        await newCart.save();
        // }
        return { _id: newCart._id, quantity: newCart.quantity, productDetailsID: newCart.productDetailsID };
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}

exports.deleteFromCart = async (userID, CartID) => {
    try {
        const deleted = await cartModel.findByIdAndDelete(CartID);
        if (!deleted) {
            return false;
        }
        const user = await userModel.findById(userID);
        user.cartList = user.cartList.filter((item) => item != CartID);
        await user.save();
        return true;
    } catch (error) {
        console.log('Error is ' + error);
        return false;
    }
}


exports.updateCart = async (cartID, quantity) => {
    try {
        console.log(cartID)
        const cart = await cartModel.findById(cartID).populate({ path: "productDetailsID", select: 'stock' });
        console.log(cart);
        if (cart.quantity + quantity > cart.productDetailsID.stock)
            return false;
        if (cart.quantity + quantity <= 0)
            cart.quantity = 0
        else
            cart.quantity += quantity;
        await cart.save();
        return true;
    } catch (error) {
        console.log("Error")
        return false;
    }
}

exports.toggleWishList = async (userID, ProductID) => {
    try {
        const user = await userModel.findById(userID);
        const exist = user.wishList.includes(ProductID);
        if (exist) {
            user.wishList = user.wishList.filter((item) => item != ProductID);
            await user.save();
            return "Deleted From WishList"
        }
        else {
            user.wishList.push(ProductID);
            await user.save();
            return "Added to WishList";
        }


    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}

exports.purchase = async (userID) => {
    try {
        let total = 0;
        const user = await userModel.findById(userID)
            .populate({ path: "cartList", select: "quantity productDetailsID", populate: { path: "productDetailsID", select: "productDetailsID quantity", populate: { path: "productID", select: "price" } } })
        const ordersList = new orderListModel({ userID: user });

        for (let cart of user.cartList) {
            console.log(cart)
            total += cart.productDetailsID.productID.price * cart.quantity;
            let newOrder = new orderModel({ quantity: cart.quantity, productDetailsID: cart.productDetailsID, orderListID: ordersList });
            ordersList.orders.push(newOrder);
            await newOrder.save();
            let productDetails = await productDetailsModel.findById(cart.productDetailsID._id)
            productDetails.stock -= cart.quantity;
            await productDetails.save();
            await cartModel.findByIdAndDelete(cart._id)
        }
        ordersList.totalPrice = total;
        await ordersList.save();
        user.cartList = [];
        user.orderList.push(ordersList);
        await user.save();
        return true;
    } catch (error) {
        console.log('Error is ' + error);
        return false;
    }
}
exports.updateUser = async (email, key, value) => {
    try {
        const user = await userModel.findOne({ email });
        user[key] = value;
        await user.save();
        return true;
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}