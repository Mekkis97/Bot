const { default: axios } = require("axios")
const chat_model = require("../model/chat_model")
const user_model = require("../model/user_model")

module.exports = async (ctx)=>{
    let chat_id = await chat_model.find()
        chat_id = chat_id[0].group_id
    const user = await user_model.find({user_id : ctx.from.id })
    if(user.length>0){
        await axios.get(`https://api.telegram.org/bot${ctx.telegram.token}/unbanChatMember?chat_id=${chat_id}&user_id=${ctx.from.id}&only_if_banned=true`)
    }
}