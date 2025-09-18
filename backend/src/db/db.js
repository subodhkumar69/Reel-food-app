// in this file we just write the logic but logic will execute in the server.js;

const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Mongodb connected")
    })
    .catch((err) => {
        console.log("Mongodb conenction", err)
    })
}

module.exports = connectDB;