import { ApplicationCommandOptionType } from 'discord.js'
import { RepeatMode } from '@jadestudios/discord-music-player'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'

const loop: ICommand = {
  name: Commands.LOOP,
  description: 'Loop a song',
  options: [
    {
      name: 'loops',
      description: 'Loop settings',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Song', value: String(RepeatMode.SONG) },
        { name: 'Queue', value: String(RepeatMode.QUEUE) },
        { name: 'Off', value: String(RepeatMode.DISABLED) }
      ]
    }
  ],
  run: async (interaction) => {
    const { guildId, options, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    const loopSettings = Number(options.getString('loops'))

    guildQueue.setRepeatMode(loopSettings)

    let message: string = ''
    if (loopSettings === RepeatMode.SONG) {
      message = 'Looping song'
    } else if (loopSettings === RepeatMode.QUEUE) {
      message = 'Looping queue'
    } else if (loopSettings === RepeatMode.DISABLED) {
      message = 'Looping disabled'
    }

    await interaction.reply(message)
  }
}

export { loop }
