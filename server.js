const express = require("express");
const dotenv = require('dotenv');
const { Connect_DB } = require("./DB_Connection")
const routes = require("./routes/index");
const cors = require("cors")
const app = express();
dotenv.config();

app.use(cors())

app.use(express.json());
Connect_DB();

app.use(routes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

function callbackListen(err) {
    if (err)
        console.log("Error While Running The App" + err)
    else
        console.log("App is Running on Port " + process.env.PORT)
}

app.get('/', (req, res) => {
    res.send("Server Is Up!")
})

app.listen(process.env.PORT, callbackListen)