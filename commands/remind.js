module.exports = {
	name: 'remind',
	description: 'Schedules a reminder.',
	execute(client, target, context, params, settings) {
        if(params.length){
            if(Number.isInteger(Number(params[0])) === true){
                var mins = params[0]
                var reminder = params.slice(1).join(' ')
                var time = mins == 1 ? "minute" : "minutes"
                console.log(mins)
                console.log(reminder)
                client.extraFunctions.sendMessage(client, target, context, `Hey ${context["display-name"]}! I'll remind you about that in ${mins} ${time}.`)
                setTimeout(function() {
                    client.extraFunctions.sendMessage(client, target, context, `Hey ${context["display-name"]}! Here's your reminder: ${reminder}`)
                }, mins * 60 * 1000)
            }
        }
	}
};
