const mongoose = require("mongoose")

const payment = new mongoose.Schema({
    user_id: Number,
    name : String,
    username: String,
    payment_amount: Number,
    telegram_charge_id: String,
    stripe_charge_id: String
},
{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("payment", payment)