const user_model = require("../model/user_model")
const fs = require('fs')
const jsoncsv = require('json-csv')

module.exports = async (ctx)=>{
    try {
        const payments = await user_model.find()
        const csv = await jsoncsv.buffered(payments , {
            fields: [
                {name: "user_id", label: "User ID"},
                {name: "user_name", label: "Name"},
                {name: "username", label: "Username"},
                {name: "purchase", label: "Purchase Date"},
                {name: "expire", label: "Expire Date"},
            ]
        })
        fs.writeFileSync('users_list.csv', csv)
        await ctx.reply("Loading...")
        ctx.telegram.sendDocument(ctx.chat.id, {source: 'users_list.csv'})
        .then(async ctx2 => await ctx.deleteMessage(ctx2.message_id - 1))
        .catch(e=>console.log(e))

    } catch (error) {
        console.log(error)
    }
}