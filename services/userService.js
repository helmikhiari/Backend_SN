const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

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

