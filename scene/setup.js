const {Scenes} = require("telegraf")
const setup_model = require("../model/setup_model")

const setup = new Scenes.WizardScene('setup',
    async ctx=>{
        try {
            ctx.session.setup = {}
            await ctx.reply("Type your pack title")
            return ctx.wizard.next()
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.title = input
                await ctx.reply("Type your pack description")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(1)
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.desc = input
                await ctx.reply("Type your pack price (only number)")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(2)
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.price = input
                await ctx.reply("Type welcome message")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(3)
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.welcome_message = input
                await ctx.reply("Type expire notification message")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(4) 
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.expire_message = input
                await ctx.reply("Type help command message")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(5) 
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.help_message = input
                await ctx.reply("Type about command message")
                return ctx.wizard.next()
            }else{
                await ctx.reply("Invalid input!")
                return ctx.wizard.selectStep(6) 
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    },
    async ctx=>{
        try {
            const input = ctx.update.message.text
            if(input){
                ctx.session.setup.about_message = input
                const data = ctx.session.setup
                const setup_data = {
                    pack_title: data.title,
                    pack_desc : data.desc,
                    pack_price: data.price,
                    welcome_message:  data.welcome_message,
                    expire_message: data.expire_message,
                    help: data.help_message,
                    about: data.about_message
                }
                const db_setup = await setup_model.find()
                if(db_setup.length>0){
                    const update_setup = await setup_model.findByIdAndUpdate(db_setup[0].id, setup_data)
                    if(update_setup){
                        await ctx.reply("Setup updated")
                    }
                }
                return ctx.scene.leave()
            }else{
                await ctx.reply("Something is wrong!")
                return ctx.wizard.selectStep(3)
            }
        } catch (error) {
            console.log(error)
            await ctx.reply("Something is wrong!")
            return ctx.scene.leave()
        }
    }
)

module.exports = setup