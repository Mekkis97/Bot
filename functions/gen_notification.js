const moment = require("moment")
const { subscription_day, notification_day } = require("../config/config")

module.exports = () => {
    const notifications_day = subscription_day - notification_day 
    return moment().add(notifications_day , 'days')
}