module.exports = {
  name: "ping",
  description: "Ping!",
  usage: "<nothing>",
  execute(message, args) {
    message.channel.send("Pong.");
  },
};
