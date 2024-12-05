const userService = require("../services/userService");
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

