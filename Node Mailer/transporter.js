const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ecoartteampi@gmail.com",
        pass: "zwsb opga qbas fwnl"
    }
})

exports.sendMail = async (email, token) => {
    await transporter.sendMail({
        from: "SN24",
        to: email,
        subject: "Reset Password Link",
        // html:"<a href=>Click Here to reset ur password</a>"
        html: `<h1>This is the token ${token}</h1>`
    })
}