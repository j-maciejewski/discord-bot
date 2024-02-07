import { ApplicationCommandOptionType, GuildMember } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import ytsr, { Video } from "ytsr"
import { isVideo } from "../../utils"

const play: ICommand = {
  name: Commands.PLAY,
  description: 'Play a song',
  options: [
    {
      name: 'song',
      description: 'Link to a song',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (interaction) => {
    const { options, guildId, member, client } = interaction

    if (!(member instanceof GuildMember)) return

    if (!member.voice.channel) {
      await interaction.reply({ ephemeral: true, content: 'Join a voice channel first' })
      return
    }

    let songLink = options.getString('song')

    await interaction.deferReply()


    if (!songLink.startsWith('https://') && !songLink.startsWith('http://')) {
      const searchResults = await ytsr(songLink, { limit: 10 })
      const video = searchResults.items.find(item => isVideo(item)) as Video
      songLink = video.url
    }

    const queue = client.player.createQueue(guildId)

    await queue.join(member.voice.channel)

    queue
      .play(songLink)
      .then(async (song) => {
        await interaction.editReply(`**${song.name}** added to queue 🤙🎶`)
      })
      .catch(async (err) => {
        if (!interaction.replied) await interaction.editReply('There was an error while playing your song')

        console.log(err)
      })
  },
}

export { play }
