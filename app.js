const {Telegraf, session, Scenes} = require("telegraf")
const { bot_token, db_url, stripe_key, password } = require("./config/config")
const { default: mongoose } = require("mongoose")
const start = require("./lib/start_menu")
const moment = require("moment")
const setup_model = require("./model/setupModel")
const user_model = require("./model/userModel")
const setup_scene = require("./scene/setupScene")
const test_data = require("./lib/testData")
const gen_expire_date = require("./lib/expire_date")
const payment_model = require("./model/paymentModel")
const insertUser = require("./lib/createUser")
const autoKickUser = require("./lib/kickUser")
const chat_model = require("./model/chatModel")
const unbanUser = require("./lib/unban")
const gen_notification = require("./lib/generate_notification")
const notification = require("./lib/notification")
const export_payment = require("./lib/export_payment_data")
const export_user = require("./lib/export_user_data")
const notification_scene = require("./scene/notifyScene")
const createChatInviteURL = require("./lib/createChatInviteURL")


const bot = new Telegraf(bot_token)

bot.use(session())

mongoose.connect(db_url)
.then(async db=>{
    console.log("DB Connected")
    await test_data()
})
.catch(e=>console.log(e))

bot.start(async ctx=>{
    start(ctx)
})

bot.action("home", async ctx=>{
    try {
        await ctx.deleteMessage()
        start(ctx)
    } catch (error) {
        console.log(error)
    }
})

const stage = new Scenes.Stage([setup_scene, notification_scene])
bot.use(stage.middleware())

bot.command("plan_status", async ctx=>{
    try {
        let chat_username = await chat_model.find()
            chat_username = chat_username[0].group_username
        let user = await user_model.find({user_id: ctx.from.id})
            user = user[0]
        if(user.expire > moment()){
            await ctx.reply(`My plan: \nStatus: Active\nExpire: ${moment(user.expire).format('MM-DD-YYYY h:m:s')}`, {
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Join telegram channel", url: `${user.join_url}`}]
                    ]
                }
            })
        }else{
            await ctx.reply(`You're not subscribed. \n \n Type /start to buy a plan`)
        }
    } catch (error) {
        console.log(error)
    }
})

bot.command("help", async ctx=>{
    try {
        let help_message = await setup_model.find()
            help_message = help_message[0].help
        await ctx.reply(help_message)
    } catch (error) {
        console.log(error)
    }
})

bot.command("about", async ctx=>{
    try {
        let about_message = await setup_model.find()
            about_message = about_message[0].about
        await ctx.reply(about_message)
    } catch (error) {
        console.log(error)
    }
})

bot.action("buy_plan", async ctx=>{
    await ctx.deleteMessage()
    let db_setup = await setup_model.find()
        db_setup = db_setup[0]    
    ctx.sendInvoice({
        title: db_setup.pack_title,
        description: db_setup.pack_desc,
        payload: 16,
        provider_token: stripe_key,
        currency: "EUR",
        prices: [
            {
                label: "Normal",
                amount: db_setup.pack_price * 100
            }
        ],
        photo_url: 'https://i.imgur.com/jvaP9cT.png'
    })
})

bot.command("buy_membership", async ctx=>{
    await ctx.deleteMessage()
    let db_setup = await setup_model.find()
        db_setup = db_setup[0]    
    ctx.sendInvoice({
        title: db_setup.pack_title,
        description: db_setup.pack_desc,
        payload: 16,
        provider_token: stripe_key,
        product_id: "prod_Op6fEdv7BRxkzB", 
        currency: "EUR",
        prices: [
            {
                label: "Normal",
                amount: db_setup.pack_price * 100
            }
        ],
        photo_url: 'https://i.imgur.com/jvaP9cT.png'
    })
})

bot.on("pre_checkout_query", async ctx=>{
    try {
        ctx.answerPreCheckoutQuery(true)
    } catch (error) {
        console.log(error)
    }
})

bot.on("successful_payment", async ctx=>{
    try {
        await ctx.deleteMessage()

        const pay = ctx.update.message.successful_payment

        let db_user = await user_model.find({user_id: ctx.from.id})
            db_user = db_user[0]

        const url = await createChatInviteURL(ctx)

        const expire = gen_expire_date(db_user.expire)
        console.log(expire)

        const user_data = {
            purchase : moment(),
            expire : expire,
            status : true,
            notification : gen_notification(),
            join_url: url
        }

        const update_user = await user_model.findByIdAndUpdate(db_user.id , user_data)
        
        if(update_user){
            ctx.replyWithPhoto({url: "https://i.imgur.com/nOkmhb2.png"})
            .then(async ctx2=>{
                await ctx.deleteMessage(ctx2.message_id - 2)
            })
            .catch(e=>console.log(e))

            const payment_data = new payment_model({
                user_id: ctx.from.id, 
                name: ctx.from.first_name,
                username: ctx.from.username,
                payment_amount: pay.total_amount / 100,
                telegram_charge_id: pay.telegram_payment_charge_id,
                stripe_charge_id: pay.provider_payment_charge_id
            })
            await payment_data.save()
            await unbanUser(ctx)

        }

    } catch (error) {
        console.log(error)
    }
})

bot.command("export_payments", async ctx=>{
    let input = ctx.update.message.text
        input = input.replace('/export_payments', '')
        input = input.trim()
    if(input == password ){
        export_payment(ctx)
    }else{
        await ctx.reply("Wrong Password!")
    }
})

bot.command("export_users", async ctx=>{
    let input = ctx.update.message.text
        input = input.replace('/export_users', '')
        input = input.trim()
    if(input == password ){
        export_user(ctx)
    }else{
        await ctx.reply("Wrong Password!")
    }
})

bot.command("setup", async ctx=>{
    try {
        let input = ctx.update.message.text
            input = input.replace('/setup', '')
            input = input.trim()
        if(input == password ){
            await ctx.scene.enter("setup")
        }else{
            await ctx.reply("Wrong Password!")
        }
    } catch (error) {
        console.log(error)
    }
})

bot.command("notify_users", async ctx=>{
    try {
        let input = ctx.update.message.text
            input = input.replace('/notify_users', '')
            input = input.trim()
        if(input == password ){
            await ctx.scene.enter("notification")
        }else{
            await ctx.reply("Wrong Password!")
        }
    } catch (error) {
        console.log(error)
    }
})

bot.on('new_chat_members', async ctx=>{
    insertUser(ctx)
})

setInterval(async () => {
    await autoKickUser()
}, 1000 * 60 * 2)

setInterval(async ()=>{
    await notification()
}, 1000 * 60 * 2)


bot.on('text', async ctx=>{
    try {

        const chat = ctx.update.message.chat

        if(chat.type == "group" || chat.type == 'supergroup'){
            const db_chat = await chat_model.find()
            const chat_data = {
                group_id : chat.id,
                group_name : chat.title,
                group_username: chat.username
            }
            if(db_chat.length>0){
                await chat_model.findByIdAndUpdate(db_chat[0].id, chat_data)
            }else{
                const new_chat = new chat_model(chat_data)
                await new_chat.save()
            }
        }

        if(ctx.update.message.forward_from_chat){
            const c = ctx.update.message.forward_from_chat
            const db_chat = await chat_model.find()

            const chatData = {
                group_id: c.id,
                group_username: c.username,
                group_name: c.title
            }
            console.log(db_chat[0].id)
            const u = await chat_model.findByIdAndUpdate(db_chat[0].id, chatData)
            console.log(u)
            await ctx.reply('Chat Updated')
        }else{
            const c = ctx.update.message.forward_from_chat
            const chatData = new chat_model({
                group_id: c.id,
                group_username: c.username,
                group_name: c.title
            })
            await chatData.save()
            await ctx.reply("Chat added")
        }
    } catch (error) {
        console.log(error)
    }
})

bot.launch()
.then(res=>console.log("Bot running"))
.catch(e=>console.log(e))