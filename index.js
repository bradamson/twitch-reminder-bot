const config = require("./config.json")
const tmi = require('tmi.js')
const fs = require('fs');
const Enmap = require("enmap");
var settings = new Enmap({name: "settings"});

var displayResult = function(result) {
  console.log(result);
};

var displayError = function(err) {
  console.error(err);
};


// Valid commands start with:
let commandPrefix = '!'
// Define configuration options:
let opts = {
  identity: {
    username: config.twitch.username,
    password: config.twitch.token
  },
  channels: config.twitch.channels
}


// These are the commands the bot knows (defined below):
let knownCommands = { echo, joinchannel, leavechannel, remind }

// Function called when the "echo" command is issued:
function echo (target, context, params) {
  console.log("Is Privileged: "+isPrivileged(context))
  if(isPrivileged(context)){
    // If there's something to echo:
    if (params.length) {
    // Join the params into a string:
    var msg = params.join(' ')
    // Interrupt attempted slash and dot commands:
    if (msg.charAt(0) == '/' || msg.charAt(0) == '.') {
        msg = 'Nice try...'
    }
    // Send it back to the correct place:
    sendMessage(target, context, msg)
    } else { // Nothing to echo
    console.log(`* Nothing to echo`)
    }
  }
}


async function remind (target, context, params) {
    if(params.length){
        if(Number.isInteger(Number(params[0])) === true){
            var mins = params[0]
            var reminder = params.slice(1).join(' ')
            var time = mins == 1 ? "minute" : "minutes"
            console.log(mins)
            console.log(reminder)
            sendMessage(target, context, `Hey ${context["display-name"]}! I'll remind you about that in ${mins} ${time}.`)
            setTimeout(function() {
                sendMessage(target, context, `Hey ${context["display-name"]}! Here's your reminder: ${reminder}`)
            }, mins * 60 * 1000)
        }
    }
}

async function joinchannel (target, context, params) {
    settings.defer.then(() => {
        var newChannel = context.username
        console.log(typeof params[0])
        if(typeof params[0] == "string"){
            newChannel = params[0]
        }
        settings.push("channels", newChannel)
        client.join(newChannel).then(() => {
            console.log(`Joined ${newChannel}`)
            sendMessage(target, context, `Joined! MrDestructoid`)
        })
    })
}

async function leavechannel (target, context, params) {
    settings.defer.then(() => {
        var leaveChannel = context.username
        settings.remove("channels", leaveChannel)
        client.leave(leaveChannel).then(() => {
            console.log(`Left ${leaveChannel}`)
            sendMessage(target, context, `Left. Bye. NotLikeThis`)
        })
    })
}

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

function isPrivileged(context){
  if ((context['badges'] != null && 'broadcaster' in context['badges']) || context['mod'] == true){
    return true
  }
  return false
}

function isSubscriber(context){
  if ((context['badges'] != null && 'subscriber' in context['badges']) || context['subscriber'] == true){
    return true
  }
  return false
}

function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}

// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot
  //console.log(context)

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
    settings.defer.then(() => {
        settings.ensure("channels",[])
        channelsToJoin = settings.get("channels")
        channelsToJoin.forEach((channel) => {
            client.join(channel).then(() => {
                console.log(`Joined ${channel}`)
            })
            
        })
    })
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Disconnected: ${reason}`)
  process.exit(1)
}

// Stuff I like.
Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}