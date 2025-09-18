// create server here 

const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes")
const foodRoutes = require("./routes/food.routes")
const foodaPartnerRoutes = require("./routes/food-partner.routes")
const cors = require("cors")


const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
// this is a middleware for taking data from body
app.use(cookieParser())
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello world!")
})

app.use("/api/auth", authRoutes)
app.use("/api/food", foodRoutes)
app.use("/api/food-partner", foodaPartnerRoutes)

module.exports = app;