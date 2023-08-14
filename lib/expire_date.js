const moment = require("moment")
const { subscription_day } = require("../config/config")

module.exports = (expire = 0) => {
    if(expire > moment()){
        return moment(expire).add(subscription_day , 'days')
    }else{
        return moment().add(subscription_day , "days")
    }
}