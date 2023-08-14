const {Scenes} = require('telegraf')
const user_model = require('../model/userModel')

const notification_scene = new Scenes.WizardScene('notification',
    async ctx=>{
        try {
            await ctx.reply("Type your notification message ( you can send text and photos)")
            return ctx.wizard.next()
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.wizard.next()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message
            const users = await user_model.find()
            if(input.text){
                users.forEach(async user => {
                    await ctx.telegram.sendMessage(user.user_id , input.text)
                })
            }else if(input.photo){
                let photo = input.photo
                    photo = photo[photo.length - 1]
                    photo = photo.file_id

                    users.forEach(async user => {
                        await ctx.telegram.sendPhoto(user.user_id, photo , {
                            caption: input.caption
                        })
                    })
            }else{
                await ctx.reply("Invalid message format!")
                return ctx.scene.leave()
            }

            return ctx.scene.leave()
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.wizard.next()
        }
    }

)

module.exports = notification_scene