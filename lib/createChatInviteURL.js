const chatModel = require("../model/chatModel")

module.exports = async (ctx)=>{
    try {
        let chat = await chatModel.find()
            chat = chat[0]
        
        const link = await ctx.telegram.createChatInviteLink(chat.group_id, {
            member_limit: 1,
            name: ctx.from.first_name
        })
        return link
    } catch (error) {
        console.log(error)
    }
}


// const chatModel = require("../model/chatModel")

// module.exports = async (ctx)=>{
//     try {
//         let chat = await chatModel.find()
//             chat = chat[0]
        
//         const link = await ctx.telegram.createChatInviteLink(chat.group_id, {
//             member_limit: 1,
//             name: ctx.from.first_name
//         })

//         chat2 = chat[1]

//         // let secondChat = await chatModel.find({ _id: { $ne: chat._id } })
//         // secondChat = secondChat[0]

//         // Create the second chat link
//         const link2 = await ctx.telegram.createChatInviteLink(chat2.group_id, {
//             member_limit: 1,
//             name: ctx.from.first_name
//         })
        
//         return { link: link.invite_link, link2: link2.invite_link }
//     } catch (error) 
//     {
//         console.log(error)
//     }
// }