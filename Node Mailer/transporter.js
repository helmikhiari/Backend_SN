const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ecoartteampi@gmail.com",
        pass: "zwsb opga qbas fwnl"
    }
})

exports.sendMail = async (email, token) => {
    const link = `${process.env.FRONT_URL}/resetPassword/${token}`
    await transporter.sendMail({
        from: "SN24",
        to: email,
        subject: "Reset Password Link",
        // html:"<a href=>Click Here to reset ur password</a>"
        html: `<a href="${link}">Click To Reset Your Password</a>`
    })
}