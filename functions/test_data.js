const setup_model = require("../model/setup_model")
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

        
    } catch (error) {
        console.log(error)
    }
}