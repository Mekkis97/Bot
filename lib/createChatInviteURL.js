const chatModel = require("../model/chatModel")

module.exports = async (ctx)=>{
    try {
        let chat = await chatModel.find()
            chat = chat[0]
        
        const link = await ctx.telegram.createChatInviteLink(chat.group_id, {
            member_limit: 1,
            name: ctx.from.first_name
        })
        return link.invite_link
    } catch (error) {
        console.log(error)
    }
}