import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  GuildMember,
} from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import ytsr, { Item, Video } from 'ytsr'
import { isVideo } from '../../utils'

const search: ICommand = {
  name: Commands.SEARCH,
  description: 'Search for a youtube video',
  options: [
    {
      name: 'video',
      description: 'Video name',
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

    const video = options.getString('video')

    await interaction.deferReply()

    try {
      const searchResults = await ytsr(video, { limit: 50 })
      const filteredVideos = searchResults.items
        .reduce(
          (items, item) => {
            if (!isVideo(item)) return items

            return items.concat({
              url: item.url,
              title: item.title,
              duration: item.duration,
              author: item.author,
            })
          },
          [] as Pick<Video, 'url' | 'title' | 'duration' | 'author'>[],
        )
        .slice(0, 5)

      const embed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle(`Results for: ${video}`)
        .setDescription(
          filteredVideos
            .map((video, idx) => `${idx + 1}. ${video.title} [${video.duration}] by ${video.author.name}`)
            .join('\n'),
        )

      const buttons = [
        ...filteredVideos.map(({ url }, idx) =>
          new ButtonBuilder()
            .setCustomId(url)
            .setLabel(`${idx + 1}`)
            .setStyle(ButtonStyle.Primary),
        ),
      ]

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(...buttons)

      const response = await interaction.editReply({ embeds: [embed], components: [row] })

      const collectorFilter = (i) => i.user.id === interaction.user.id
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 15_000 })

        const videoLink = confirmation.customId

        const queue = client.player.createQueue(guildId)

        await queue.join(member.voice.channel)

        queue
          .play(videoLink)
          .then(async (song) => {
            await interaction.editReply({
              content: `**${song.name}** added to queue 🤙🎶`,
              components: [],
              embeds: [],
            })
          })
          .catch(async (err) => {
            if (!interaction.replied) await interaction.editReply('There was an error while playing your song')

            console.log(err)
          })
      } catch (e) {
        await interaction.editReply({
          content: 'Confirmation not received within 15 seconds, cancelling',
          components: [],
          embeds: [],
        })
      }
    } catch (error) {
      console.log(error)
    }
  },
}

export { search }
