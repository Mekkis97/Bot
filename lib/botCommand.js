module.exports = async (ctx) =>{
    try {
        ctx.setMyCommands([
            {
                command: "start",
                description: "For start"  //
            },
            {
                command: "plan_status",
                description: "Plan Status"
            },
            {
                command: "buy_plan",
                description: "For Buy/Renew membership"
            },
            {
                command: "help",
                description: "For help"
            },
            {
                command: "about",
                description: "About Us"
            }
        ])
    } catch (error) {
        console.log(error)
    }
}