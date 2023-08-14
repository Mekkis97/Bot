const payment_model = require("../model/paymentModel")
const fs = require('fs')
const jsoncsv = require('json-csv')

module.exports = async (ctx)=>{
    try {
        const payments = await payment_model.find()
        const csv = await jsoncsv.buffered(payments , {
            fields: [
                {name: "user_id", label: "User ID"},
                {name: "name", label: "Name"},
                {name: "username", label: "Username"},
                {name: "payment_amount", label: "Amount(cents)"},
                {name: "telegram_charge_id", label: "Telegram charge ID"},
                {name: "stripe_charge_id", label: "Stripe charge ID"}
            ]
        })
        fs.writeFileSync('payments_list.csv', csv)
        await ctx.reply("Loading...")
        ctx.telegram.sendDocument(ctx.chat.id, {source: 'payments_list.csv'})
        .then(async ctx2 => await ctx.deleteMessage(ctx2.message_id - 1))
        .catch(e=>console.log(e))

    } catch (error) {
        console.log(error)
    }
}