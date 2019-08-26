module.exports = {
	name: 'joinchannel',
	description: 'Joins a channel.',
	execute(client, target, context, params, settings) {
        settings.defer.then(() => {
            var newChannel = context.username
            console.log(typeof params[0])
            if(typeof params[0] == "string"){
                newChannel = params[0]
            }
            settings.push("channels", newChannel)
            client.join(newChannel).then(() => {
                console.log(`Joined ${newChannel}`)
                client.extraFunctions.sendMessage(client, target, context, `Joined! MrDestructoid`)
            })
        })
	}
};
