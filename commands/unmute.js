module.exports = {
  name: "unmute",
  description:
    "Unmutes the voice channel that the user is in. Requires user to be in a voice channel.",
  aliases: ["um", "u", "yell"],
  gcd: 6,
  execute(message, args) {
    const vcOfMember = message.member.voice.channel;
    if (vcOfMember) {
      message.channel.send("```You can almost talk again```");
      let voiceChannel = message.guild.channels.cache.get(vcOfMember.id);

      voiceChannel.members.forEach((member, i) => {
        member.voice.setMute(false);
      });
      message.channel.send("```Now you can talk :D```");
    } else {
      message.reply("```Join a voice channel to unmute :)```");
    }
  },
};
