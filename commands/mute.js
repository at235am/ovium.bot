module.exports = {
  name: "mute",
  description:
    "Mutes the voice channel that the user is in. Requires user to be in a voice channel.",
  aliases: ["m", "mu", "shh", "hush"],
  gcd: 6,
  execute(message, args) {
    const vcOfMember = message.member.voice.channel;

    if (vcOfMember) {
      message.channel.send("```MUTING is in progress```");
      let voiceChannel = message.guild.channels.cache.get(vcOfMember.id);

      voiceChannel.members.forEach((member, i) => {
        member.voice.setMute(true);
      });
      message.channel.send(
        "```MUTING COMPLETED. No one can hear you die now>:)```"
      );
    } else {
      message.reply("```Join a voice channel to mute  :)```");
    }
  },
};
