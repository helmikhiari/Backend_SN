const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const cartModel = require("../models/cart");
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
        const user = await userModel.findById(userID).select("firstName lastName email")

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
        const cart = await cartModel.findOne({ productDetailsID });
        if (cart) {
            cart.quantity += quantity;
            await cart.save();
        }
        else {
            const user = await userModel.findById(userID);
            const newCart = new cartModel({ productDetailsID, quantity, userID: user });
            user.cartList.push(newCart);
            await user.save();
            await newCart.save();
        }
        return true;
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
        const cart = await cartModel.findById(cartID).populate({ path: "productDetailsID", select: 'stock' });
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
        const exist = user.wishlist.includes(ProductID);
        if (exist) {
            user.wishlist = user.wishlist.filter((item) => item != ProductID);
            await user.save();
            return "Deleted From WishList"
        }
        else {
            user.wishlist.push(ProductID);
            await user.save();
            return "Added to WishList";
        }


    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}