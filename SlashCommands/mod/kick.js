const Discord = require("discord.js")
const { MessageEmbed, MessageActionRow, MessageButton } = Discord

module.exports = {
  name: "kick",
  description: "kicks the tagged user from the guild!",
  type: "CHAT_INPUT",
  category: "mod",
  userPerms: ["KICK_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
  botPerms: ["KICK_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
  options: [
    {
      name: "user",
      type: "USER",
      description: "Tag a user who will be kicked from this guild.",
      required: true,
    },
    {
      name: "reason",
      type: "STRING",
      description: "Reason for kicking the user from this guild.",
      required: true,
    },
  ],
  execute: async (client, interaction, args) => {
    const u = interaction.options.get("user")
    const r = interaction.options.get("reason")
    const user = client.users.cache.get(u.value)
    const member = interaction.guild.members.cache.get(u.value)
    const reason = r.value

    const KickEmbed = new MessageEmbed()
      .setTitle("User was successfully Kicked from this guild!")
      .setDescription("Here's some Important Information given below ↓")
      .setColor("GREEN")
      .setAuthor({
        name: client.user.username,
        url: client.user.avatarURL({ dynamic: true }),
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField("Moderator:", interaction.user.tag)
      .addField("Kicked User:", user.tag)
      .addField("Reason:", reason)

    const Hierarchy = new MessageEmbed()
      .setTitle("Error while kicking the user from this guild!")
      .setColor("RED")
      .setAuthor({
        name: client.user.username,
        url: client.user.avatarURL({ dynamic: true }),
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        "Reason:",
        "I was unable to kick the user because user's role is higher than mine!"
      )

    if (!member.kickable) {
      interaction.followUp({
        embeds: [Hierarchy],
      })
    } else {
      interaction.followUp({
        embeds: [KickEmbed],
      })
      member.kick(reason)
    }
  },
}
