const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        if (!foodPartner) {
            return res.status(401).json({ message: "Food partner not found" });
        }

        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;   // ✅ FIXED (was req.foodItems)
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
};
