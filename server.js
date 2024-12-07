const express = require("express");
const dotenv = require('dotenv');
const { Connect_DB } = require("./DB_Connection")
const routes = require("./routes/index");
const app = express();
dotenv.config();
app.use(express.json());
Connect_DB();

app.use(routes);

app.use("/uploads", express.static("uploads"));

function callbackListen(err) {
    if (err)
        console.log("Error While Running The App" + err)
    else
        console.log("App is Running on Port " + process.env.PORT)
}





app.listen(process.env.PORT, callbackListen)