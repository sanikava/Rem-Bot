const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")

// JS declrations:
const BattleSpecs = require("./battlesettings")
const AttackArr = require("./battlesettings")
const UserSpecs = require("./battlesettings")
const BotSpecs = require("./battlesettings")

module.exports = {
  name: "startbattle",
  description: "Start the Battle between you & the Bot!",
  type: "CHAT_INPUT",
  category: "game:battle",
  botPerms: ["SEND_MESSAGES", "EMBED_LINKS"],
  execute: async (client, interaction, args) => {
    let Player1HP = BotSpecs.hp
    let Player2HP = UserSpecs.hp

    let newBHP
    let newUHP

    let msg

    let botAttack
    function BotAttack() {
      botAttack =
        BotSpecs.attacks[Math.floor(Math.random() * BotSpecs.attacks.length)]
    }

    let userDamage
    const UserDamage = () => {
      userDamage = Math.floor(Math.random() * 200)
    }

    let botDamage
    const BotDamage = () => {
      botDamage = Math.floor(Math.random() * 200)
    }

    let randomAttack
    function RandomAttack() {
      randomAttack =
        UserSpecs.attacks[Math.floor(Math.random() * UserSpecs.attacks.length)]
    }

    const BattleBeginEm = new MessageEmbed()
      .setTitle("The Battle has begun!")
      .setColor("#00FFF")
      .setAuthor({
        name: client.user.username,
        url: client.user.avatarURL({ dynamic: true }),
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        `Started the battle between Bot & You! More Details are Provided below:`
      )
      .addField("Player 1:", `${client.user.tag}`)
      .addField("Player 2:", `${interaction.user.tag}`)
      .addField(
        "How to Play?",
        `Use the buttons Provided below to do Random Damage to Bot. Bot will do the same to you.\nAfter each move done by you & bot, embed will be updated to the latest HP & Damage.\nRandom Attack Button will do a Random Attack(either Kick or Punch).`
      )
      .addField(
        "What damage do the attacks do?",
        "The Attacks do a damage between 0 to 200."
      )
      .addField(
        "HP the Players get:",
        "Both of the Players will get 800 HP, easy to take down each other? Maybe."
      )

    start()

    async function start() {
      const BattleBeginButton = new MessageActionRow()

        .addComponents(
          new MessageButton()
            .setLabel("Kick")
            .setStyle("DANGER")
            .setCustomId("KICK")
            .setEmoji("🦶")
        )
        .addComponents(
          new MessageButton()
            .setLabel("Punch")
            .setStyle("DANGER")
            .setCustomId("PUNCH")
            .setEmoji("🤜")
        )
        .addComponents(
          new MessageButton()
            .setLabel("Random")
            .setStyle("DANGER")
            .setCustomId("RANDOM")
        )

      let csg = await interaction.followUp({
        embeds: [BattleBeginEm],
      })
      msg = await interaction.channel.send({
        content:
          "Use Buttons to select a move! Timeout for current moves: 30seconds.",
        components: [BattleBeginButton],
      })
      colEvent()
    }

    async function colEvent() {
      const filter = (i) => i.user.id === interaction.user.id

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 30000,
      })

      collector.on("collect", async (i) => {
        BotAttack()
        RandomAttack()
        BotDamage()
        UserDamage()
        if (i.customId === "KICK") {
          await i.update({
            content: `You chose \`KICK\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = UserSpecs.hp - userDamage
          let Player2HP = UserSpecs.hp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        } else if (i.customId === "PUNCH") {
          await i.update({
            content: `You chose \`PUNCH\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = UserSpecs.hp - userDamage
          let Player2HP = UserSpecs.hp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        } else if (i.customId === "RANDOM") {
          await i.update({
            content: `You chose \`${randomAttack}\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = UserSpecs.hp - userDamage
          let Player2HP = UserSpecs.hp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        }
      })
      collector.on("end", (collected) => {
        if (collected.size <= 0) {
          msg.edit({
            components: [],
            embeds: [],
            content: "User did not choose any option. Ending the Battle.",
          })
        }
      })
    }

    async function BattleLoop(p1hp, p2hp) {
      if (p1hp <= 0 && p2hp > p1hp) {
        await msg.edit({
          content: `Player 2(User) Won the Game! Congratulations & celebrations!!`,
        })
      } else if (p2hp <= 0 && p2hp < p1hp) {
        await msg.edit({
          content: `Player 1(Bot) Won the Game! Better Luck next time Mr/Mrs. User!!`,
        })
      } else if (p1hp !== 0 && p2hp !== 0) {
        newAttack(p1hp, p2hp)
      }
    }

    async function newAttack(bhp, uhp) {
      const newAttackEm = new MessageEmbed()
        .setTitle("Choose Another Attack!!")
        .setColor("GREEN")
        .setAuthor({
          name: client.user.username,
          url: client.user.avatarURL({ dynamic: true }),
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setDescription("You have 10 seconds, Choose another Attack!")
        .addField("Player 1 HP:(Bot)", `${bhp}/800`)
        .addField("Player 2 HP:(User)", `${uhp}/800`)

      const newAttackButton = new MessageActionRow()

        .addComponents(
          new MessageButton()
            .setLabel("Kick")
            .setStyle("DANGER")
            .setCustomId("kick")
            .setEmoji("🦶")
        )
        .addComponents(
          new MessageButton()
            .setLabel("Punch")
            .setStyle("DANGER")
            .setCustomId("punch")
            .setEmoji("🤜")
        )
        .addComponents(
          new MessageButton()
            .setLabel("Random")
            .setStyle("DANGER")
            .setCustomId("random")
        )

      await msg.edit({
        embeds: [newAttackEm],
        components: [newAttackButton],
      })
      let Player1HP = bhp
      let Player2HP = uhp
      newAttackColEvent(Player1HP, Player2HP)
    }

    async function newAttackColEvent(nbhp, nuhp) {
      const filter = (i) => i.user.id === interaction.user.id

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 10000,
      })

      collector.on("collect", async (i) => {
        BotAttack()
        RandomAttack()
        BotDamage()
        UserDamage()

        if (i.customId === "kick") {
          await i.update({
            content: `You chose \`KICK\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = nbhp - userDamage
          let Player2HP = nuhp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        } else if (i.customId === "punch") {
          await i.update({
            content: `You chose \`PUNCH\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = nbhp - userDamage
          let Player2HP = nuhp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        } else if (i.customId === "random") {
          await i.update({
            content: `You chose \`${randomAttack}\`! Bot chose: \`${botAttack}\`.`,
            components: [],
            embeds: [],
          })
          let Player1HP = nbhp - userDamage
          let Player2HP = nuhp - botDamage
          collector.stop()
          if (Player1HP !== 0 && Player2HP !== 0) {
            return BattleLoop(Player1HP, Player2HP)
          }
        }
      })

      collector.on("end", (collected) => {
        if (collected.size <= 0) {
          msg.edit({
            components: [],
            embeds: [],
            content: "User did not choose any option. Ending the Battle.",
          })
        }
      })
    }
  },
}
