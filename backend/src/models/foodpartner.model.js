const mongoose = require("mongoose")

const foodPartnerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    contactName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String
    }
});

const foodPartnerModel = mongoose.model("foodPartner", foodPartnerSchema)

module.exports = foodPartnerModel;