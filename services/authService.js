const userModel = require("../models/user");
const bcrypt = require("bcryptjs")
exports.login = async (email, password) => {
    try {
        const user = await userModel.findOne({ email });
        const passwordsMatch = bcrypt.compareSync(password, user.password);
        if (passwordsMatch)
            return user.id;
        return false;
    } catch (error) {
        console.log("error " + error)
        return false;
    }
}

exports.matchPassword = async (email, newPassword) => {
    try {
        const user = await userModel.findOne({ email })
        const match = bcrypt.compareSync(newPassword, user.password);
        return match;
    } catch (error) {
        console.log("Error is " + error);
    }
}


exports.checkCode = async (email, code) => {
    try {
        const user = await userModel.findOne({ email, code });
        return !!user;
    } catch (error) {

    }
}


exports.changePassword = async (email, newPassword) => {
    try {
        const salt = bcrypt.genSaltSync();
        console.log(salt);
        const hashedPassword = bcrypt.hashSync(newPassword, salt);
        const updatedUser = await userModel.findOneAndUpdate({ email }, { password: hashedPassword, code: null });
        return !!updatedUser
    } catch (error) {
        console.log("Error is " + error);
        return false;
    }
}