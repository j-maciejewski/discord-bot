import { ApplicationCommandOptionType, GuildMember } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'

const play: ICommand = {
  name: Commands.PLAY,
  description: 'Play a song',
  options: [
    {
      name: 'song',
      description: 'Link to a song',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async (interaction) => {
    const { options, guildId, member, client } = interaction

    if (!(member instanceof GuildMember)) return

    if (!member.voice.channel) {
      await interaction.reply({ ephemeral: true, content: 'Join a voice channel first' })
      return
    }

    const songLink = options.getString('song')

    const queue = client.player.createQueue(guildId)

    await queue.join(member.voice.channel)

    await interaction.deferReply()

    queue.play(songLink)
      .then(async song => {
        await interaction.editReply(`Song **${song.name}** added to queue 🤙🎶`)
      })
      .catch(async (err) => {
        if (!interaction.replied) await interaction.editReply('There was an error while playing your song')

        console.log(err)
      })
  }
}

export { play }
