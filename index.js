const config = require("./config.json")
const tmi = require('tmi.js')
const fs = require('fs');
const Enmap = require("enmap");
var settings = new Enmap({name: "settings"});

// Define configuration options:
let opts = {
  identity: {
    username: config.twitch.username,
    password: config.twitch.token
  },
  channels: config.twitch.channels,
  options: {
    commandPrefix: config.bot.commandPrefix || "!",
    debug: config.bot.debug || false
  },
  connection: {
    secure: config.bot.secure || true
  }
}

// Create a client with our options:
let client = new tmi.client(opts)

// Build commands from commands folder
client.commands = new Map()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// Import extra functions
client.extraFunctions = require('./functions')
console.log(client)

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
  if (msg.substr(0, 1) !== client.opts.options.commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0].toLowerCase()
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  if (commandName == "joinchannel"){
    client.commands.get("joinchannel").execute(client, target, context, params, settings)
  }
  if (commandName == "leavechannel"){
    client.commands.get("leavechannel").execute(client, target, context, params, settings)
  }
  if (commandName == "echo"){
    client.commands.get("echo").execute(client, target, context, params, settings)
  }
  if (commandName == "remind"){
    client.commands.get("remind").execute(client, target, context, params, settings)
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