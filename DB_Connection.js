const mongoose=require('mongoose');

async function Connect_DB()
{
    try {
       await  mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to DATABASE")
    } catch (error) {
        console.log("Error while connecting to the database"+error);   
    }
}
module.exports={Connect_DB}