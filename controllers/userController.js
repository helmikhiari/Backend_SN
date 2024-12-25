const userService = require("../services/userService");
const productService = require("../services/productService")
exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const exist = await userService.checkUserExists(email)
        if (exist) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const result = await userService.register(email, lastName, firstName, password);
        if (result)
            return res.status(201).json({ message: "User Registered !" })
        else
            return res.status(400).json({ message: "Registration Error" });
    } catch (error) {
        console.log("error" + error);
    }
}

exports.getUser = async (req, res) => {
    try {

        const user = await userService.getUserByID(req.userID);

        if (!user)
            return res.status(403).json({ message: "Error while fetching user data" })
        return res.status(200).send(user);
    } catch (error) {
        console.log("error " + error);
    }
}

exports.updateUser = async (req, res) => {
    try {
        if (req.body.email || req.body.password) {
            return res.status(401).json({ message: "You can only update the first and the last name" });
        }
        const updated = await userService.updateUser(req.userID, req.body);
        if (!updated) {
            return res.status(400).json({ message: "Error while updating" });
        }
        return res.status(200).json({ message: "User Updated!" });
    } catch (error) {
        console.log("Error is " + error);
        return res.status(500).json({ message: error.message });
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const checkOldPassword = await userService.checkOldPassword(req.userID, oldPassword);
        if (!checkOldPassword) {
            return res.status(401).json({ message: "Incorrect Old Password" });
        }
        if (oldPassword == newPassword) {
            return res.status(409).json({ message: "new Password must be different form new Password" });
        }
        const updated = await userService.changePassword(req.userID, newPassword);
        if (!updated) {
            return res.status(400).json({ message: "Error while updating" });
        }
        return res.status(200).json({ message: "Password Changed!" });
    } catch (error) {
        console.log("Error is " + error);
        return res.status(500).json({ message: error.message });
    }
}

exports.addToCart = async (req, res) => {
    try {
        const { productDetailID, quantity } = req.body;
        const added = await userService.addToCart(req.userID, productDetailID, quantity);
        if (!added)
            return res.status(400).json({ message: "Error Occured" });
        console.log(added);
        return res.status(201).json(added);
    } catch (error) {

    }
}

exports.deleteFromCart = async (req, res) => {
    try {

        const deleted = await userService.deleteFromCart(req.userID, req.params.cartID);
        if (!deleted) {
            return res.status(404).json({ message: "Cart Not Found" });
        }
        return res.status(204).json({ message: "Deleted" });
    } catch (error) {
        console.log("Error is" + error);
        return res.status(500).json({ message: error.message });
    }
}

exports.updateCart = async (req, res) => {
    try {
        const updated = await userService.updateCart(req.body.cartID, req.body.quantity);
        if (!updated) {
            return res.status(400).json({ message: "Out of stock" });
        }
        return res.status(200).json({ message: "updated Successfully" });
    } catch (error) {
        console.log("Error is" + error);
        return res.status(500).json({ message: error.message });
    }
}

exports.toggleWishList = async (req, res) => {
    try {
        const { productID } = req.body;
        const result = await productService.checkProductExistence(productID);
        if (!result)
            return res.status(404).json({ message: "Product Not Found" })
        const msg = await userService.toggleWishList(req.userID, productID);
        if (!msg) {
            return res.status(400).json({ message: "Error Occured" });
        }
        return res.status(200).json({ message: msg });
    } catch (error) {

    }
}

exports.purchase = async (req, res) => {
    try {
        const rep = await userService.purchase(req.userID);
        if (!rep) {
            return res.status(403).json({ message: "Purchase Failed" })
        }
        return res.status(201).json({ message: "Purchase Confirmed" })
    } catch (error) {
        console.log("Error : " + error)
    }
}