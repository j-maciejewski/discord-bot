import { type Queue, RepeatMode } from '@jadestudios/discord-music-player'
import { EmbedBuilder } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'

const buildPlayerMessage = (guildQueue: Queue): EmbedBuilder => {
  const embed = new EmbedBuilder()

  if (guildQueue?.songs?.length > 0) {
    embed
      .setColor('#0099ff')
      .setTitle('Now playing')
      .setDescription(
        `${guildQueue.songs[0].name} [${
          guildQueue.songs[0].isLive && guildQueue.songs[0].duration === '00:00'
            ? 'LIVE'
            : guildQueue.songs[0].duration
        }]`
      )
      .setImage(guildQueue.songs[0].thumbnail)

    if (guildQueue.songs.length > 1) {
      let queueMessage = ''
      if (guildQueue.songs.slice(1, guildQueue.songs.length).length <= 15) {
        queueMessage += guildQueue.songs
          .slice(1)
          .map(
            (song, idx) =>
              `${idx + 1}. ${song.name} [${
                song.isLive && song.duration === '00:00'
                  ? 'LIVE'
                  : song.duration
              }]`
          )
          .join('\n')
      } else {
        queueMessage += guildQueue.songs
          .slice(1, 16)
          .map(
            (song, idx) =>
              `${idx + 1}. ${song.name} [${
                song.isLive && song.duration === '00:00'
                  ? 'LIVE'
                  : song.duration
              }]`
          )
          .join('\n')
        queueMessage += `\nand ${guildQueue.songs.length - 16} more...`
      }

      embed.addFields({
        name: 'Queue',
        value: queueMessage
      })
    }

    const footer = []

    if (guildQueue.connection.paused) footer.push('Paused')

    if (guildQueue.repeatMode === RepeatMode.SONG) footer.push('Looping: song')
    else if (guildQueue.repeatMode === RepeatMode.QUEUE) { footer.push('Looping: queue') }

    if (footer.length > 0) embed.setFooter({ text: footer.join(' | ') })
  } else {
    embed
      .setColor('#E6007E')
      .setTitle('No song is playing currently')
      .setImage('https://media.discordapp.net/stickers/888330197332529162.webp')
  }

  return embed
}

const queue: ICommand = {
  name: Commands.QUEUE,
  description: 'Display player queue',
  run: async (interaction) => {
    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    const embed = buildPlayerMessage(guildQueue)

    await interaction.reply({ embeds: [embed] })
  }
}

export { queue }
