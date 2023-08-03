const { default: axios } = require("axios")
const setup_model = require("../model/setup_model")
const user_model = require("../model/user_model")
const { bot_token } = require("../config/config")
const moment = require('moment')

module.exports = async (ctx)=>{
    try {

        let notification_message = await setup_model.find()
            notification_message = notification_message[0].expire_message || "Your plan will expire soon. \n \n You will be removed from the group in 3 days. To stay in the group, we kindly ask you to renew your plan. \n \n Type /start to renew your plan"

        const users = await user_model.find()

        users.forEach(async user => {
            if(moment() > user.notification){
                if(user.notification_status){

                    axios.get(`https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${user.user_id}&text=${notification_message}`)

                    await user_model.findByIdAndUpdate(user.id, {notification_status: false})
                }
            }
        })
    } catch (error) {
        console.log(error)
    }
}