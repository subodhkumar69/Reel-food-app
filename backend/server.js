//  run server here 
require("dotenv").config();
const app = require("./src/app")
const connectDB = require("./src/db/db")

connectDB();

app.listen(3000, () => {
    console.log(`server is running at port 3000`)
})