const mongoose = require("mongoose")

const user = new mongoose.Schema({
    user_id : Number,
    user_name : String,
    username : String,
    purchase: Date,
    expire: Date,
    status: {
        type: Boolean,
        default: false
    },
    notification_status: {
        type: Boolean,
        default: true
    },
    notification: Date,
    join_url: String,
    join_url2: String,
    join_url3: String

},
{
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('user', user)