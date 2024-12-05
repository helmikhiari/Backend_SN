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