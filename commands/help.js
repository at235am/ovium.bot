const { prefix } = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command.",
  aliases: ["commands", "cmd", "ob"],
  usage: "[command name]",
  cooldown: 5,
  execute(message, args) {
    const { commands } = message.client;

    if (!args.length) {
      const embed = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Commands")
        .setURL("https://discord.js.org/")
        .setAuthor(
          "at23am",
          "https://i.imgur.com/wSTFkRM.png",
          "https://github.com/at235am/"
        )
        .setDescription(
          "Hey my name's ovium.bot but you can call me o.b. (ohbi) or ob (awb). This list is all the stuff my shepherd has taught me!"
        );
      commands.forEach((cmd, i) => {
        console.log(cmd.name);
        console.log(cmd.description);
        embed.addField(`${prefix}${cmd.name}`, cmd.description);
      });

      embed.addField(
        "--------------------------------------------",
        `**USE \`${prefix}help <command>\` FOR MORE DETAILS ON A SPECIFIC COMMAND**`
      );

      return message.reply(embed);
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    const embed = new Discord.MessageEmbed().setColor("#0099ff");

    embed.addField(
      `\`${prefix}${command.name}${command.args ? ` ${command.usage}` : ""}\``,
      `${command.description}\nAlso known as ${command.aliases
        .map((item) => `\`${prefix}${item}\``)
        .join(" ")}`
    );

    message.reply(embed);
  },
};
