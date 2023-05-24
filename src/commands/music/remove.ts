import { ApplicationCommandOptionType } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const remove: ICommand = {
  name: Commands.REMOVE,
  description: 'Remove a song',
  options: [
    {
      name: 'index',
      description: 'Index of song',
      type: ApplicationCommandOptionType.Integer,
      required: true
    }
  ],
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { options, guildId, client } = interaction

    const songIndex = options.getInteger('index')

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.remove(songIndex)

    await interaction.reply('Song removed')
  }
}

export { remove }
