const chatModel = require("../model/chatModel")
const setup_model = require("../model/setupModel")
module.exports = async ()=>{
    try {
        const setup_data = await setup_model.find()
        if(setup_data.length>0){
            console.log("Setup collection exists")
        }else{
            const test_setup = new setup_model({
                pack_title: "Test payment",
                pack_desc : "Test payment description",
                pack_price: 10,
                welcome_message: "This test welcome message",
                expire_message: "This test expire message",
                help: "this is test help message",
                about: "this is test about message"
            })
            await test_setup.save()
        }

        const testData = await chatModel.find()
        if(testData.length>0){
            console.log("Chat already exists")
        }else{
            const chat = new chatModel({
                group_id: 1234234,
                group_username: "@testgroup",
                group_name: "Test Group"
            })
            await chat.save()
        }

        
    } catch (error) {
        console.log(error)
    }
}