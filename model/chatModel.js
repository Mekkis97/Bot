const mongoose = require("mongoose")

const chat = new mongoose.Schema({
    group_id: Number,
    group_username : String,
    group_name: String
},
{
    versionKey: false,
    timestamps: true
})

module.exports = mongoose.model("chat", chat)