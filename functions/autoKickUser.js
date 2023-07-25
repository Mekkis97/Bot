const { default: axios } = require("axios")
const user_model = require("../model/user_model")
const moment = require("moment")
const { bot_token } = require("../config/config")
const chat_model = require("../model/chat_model")


module.exports = async ()=>{
    try {
        let chat_id = await chat_model.find()
            chat_id = chat_id[0].group_id
        const users = await user_model.find()
        users.forEach(async (user) => {
            if(moment() > user.expire){
                axios.get(`https://api.telegram.org/bot${bot_token}/banChatMember?chat_id=${chat_id}&user_id=${user.user_id}&revoke_messages=true`)
                await user_model.findByIdAndUpdate(user.id, {status: false})
            }
        })
    } catch (error) {
        console.log(error)
    }
}