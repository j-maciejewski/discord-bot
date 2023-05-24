import { ApplicationCommandOptionType, GuildMember } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'

const playlist: ICommand = {
  name: Commands.PLAYLIST,
  description: 'Play songs from playlist',
  options: [
    {
      name: 'playlist',
      description: 'Paste your playlist url',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  run: async (interaction) => {
    const { options, guildId, member, client } = interaction

    if (!(member instanceof GuildMember)) return

    const playlistUrl = options.getString('playlist')

    const queue = client.player.createQueue(guildId)

    await queue.join(member.voice.channel)

    await interaction.deferReply()

    queue.playlist(playlistUrl)
      .then(async playlist => {
        await interaction.editReply(`🎶 ${playlist.songs.length} songs from playlist **${playlist.name}** was added to the queue 🎶`)
      })
      .catch(console.log)
  }
}

export { playlist }
