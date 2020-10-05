const fs = require("fs");
const Discord = require("discord.js");
const { prefix, token } = require("./config.json");

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const globalCooldowns = new Discord.Collection();

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // HANDLES ALIASES:
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  // HANDLES ARGUMENTS:
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  // HANDLES USER COOLDOWNS:
  if (!cooldowns.has(command.name)) {
    const test = new Discord.Collection();
    cooldowns.set(command.name, test);
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id) && command.cooldown) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // HANDLES GLOBAL COOLDOWNS:
  const gnow = Date.now();
  console.log("globalCooldowns1", globalCooldowns);
  const gcooldownAmount = command.gcd ? command.gcd * 1000 : 0;

  if (globalCooldowns.has(command.name)) {
    const gexpirationTime = globalCooldowns.get(command.name) + gcooldownAmount;
    if (gnow < gexpirationTime) {
      const timeLeft = (gexpirationTime - gnow) / 1000;
      return message.reply(
        `\nSomeone beat you to it or you're tryna spam ob >:( chill for ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  if (!globalCooldowns.has(command.name) && command.gcd) {
    globalCooldowns.set(command.name, gnow);
  }

  setTimeout(() => globalCooldowns.delete(command.name), gcooldownAmount);
  // START OF COMMAND EXECUTION:
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(token);
