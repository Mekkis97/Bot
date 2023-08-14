const mongoose = require("mongoose")
const setup = new mongoose.Schema({
    pack_title: String,
    pack_desc : String,
    pack_price: Number,
    welcome_message: String,
    expire_message : String,
    help: String,
    about: String
},
{
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model("setup", setup)