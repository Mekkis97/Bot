const { default: axios } = require("axios")
const chat_model = require("../model/chatModel")
const user_model = require("../model/userModel")

module.exports = async (ctx)=>{
    let chat_id = await chat_model.find()
        chat_id = chat_id[0].group_id
    let chat_id2 = await chat_model.find()
        chat_id2 = chat_id[1].group_id        
    const user = await user_model.find({user_id : ctx.from.id })
    if(user.length>0){
        await axios.get(`https://api.telegram.org/bot${ctx.telegram.token}/unbanChatMember?chat_id=${chat_id}&user_id=${ctx.from.id}&only_if_banned=true`)
        await axios.get(`https://api.telegram.org/bot${ctx.telegram.token}/unbanChatMember?chat_id=${chat_id2}&user_id=${ctx.from.id}&only_if_banned=true`)        
    }
}