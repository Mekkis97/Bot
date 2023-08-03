const insertUser = require("./insertUser")
const commands = require("./commands")
const setup_model = require("../model/setup_model")

module.exports = async (ctx) =>{
    try {
        let db_setup = await setup_model.find()
            db_setup = db_setup[0]
        await ctx.reply(`👏 Hello , ${ctx.from.first_name} \n${db_setup.welcome_message || ""} `,{
            reply_markup: {
                inline_keyboard: [
                    [{text: "Buy a subsciption", callback_data: "buy_plan"}]
                ]
            }
        })
        insertUser(ctx)
        commands(ctx)
    } catch (error) {
        console.log(error)
    }
}