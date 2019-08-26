module.exports = {
    // Helper function to send the correct type of message:
    sendMessage: function (client, target, context, message) {
        if (context['message-type'] === 'whisper') {
            client.whisper(target, message)
        } else {
            client.say(target, message)
        }
    },

    // Helper function to determine if current user is mod
    isPrivileged: function (context) {
        if ((context['badges'] != null && 'broadcaster' in context['badges']) || context['mod'] == true){
            return true
        }
        return false
    },

    // Helper function to determine if current user is a sub
    isSubscriber: function (context) { 
        if ((context['badges'] != null && 'subscriber' in context['badges']) || context['subscriber'] == true){
            return true
        }
        return false
    },

    // Sleep is good.
    sleep: function (ms){
        return new Promise(resolve=>{
            setTimeout(resolve,ms)
        })
    }
}