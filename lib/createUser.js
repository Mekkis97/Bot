const user = require("../model/userModel")

module.exports = async (ctx)=>{
    try {
        const isregisterd = await user.find({user_id: ctx.from.id})
        if(isregisterd.length>0){
            console.log('User exists')
        }else{
            const userData = {
                user_id : ctx.from.id,
                user_name : ctx.from.first_name,
                username : ctx.from.username
            }
            const deploy_user = new user(userData)
            await deploy_user.save()
        }
    } catch (error) {
        console.log(error)
    }
}