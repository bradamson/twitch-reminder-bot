module.exports = {
	name: 'leavechannel',
	description: 'Leaves a channel.',
	execute(client, target, context, params, settings) {
        settings.defer.then(() => {
            var leaveChannel = context.username
            settings.remove("channels", leaveChannel)
            client.leave(leaveChannel).then(() => {
                console.log(`Left ${leaveChannel}`)
                client.extraFunctions.sendMessage(client, target, context, `Left. Bye. NotLikeThis`)
            })
        })
	}
};
