module.exports = {
	name: 'echo',
	description: 'Echoooooo.',
	execute(client, target, context, params, settings) {
        console.log("Is Privileged: "+client.extraFunctions.isPrivileged(context))
        if(client.extraFunctions.isPrivileged(context)){
          // If there's something to echo:
          if (params.length) {
          // Join the params into a string:
          var msg = params.join(' ')
          // Interrupt attempted slash and dot commands:
          if (msg.charAt(0) == '/' || msg.charAt(0) == '.') {
              msg = 'Nice try...'
          }
          // Send it back to the correct place:
          client.extraFunctions.sendMessage(client, target, context, msg)
          } else { // Nothing to echo
          console.log(`* Nothing to echo`)
          }
        }
	}
};
