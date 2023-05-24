import { ApplicationCommandOptionType } from 'discord.js'

import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const seek: ICommand = {
  name: Commands.SEEK,
  description: 'Seek a song time',
  options: [
    {
      name: 'seconds',
      description: 'Enter seconds...',
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

    const seconds = options.getInteger('seconds')

    const guildQueue = client.player.getQueue(guildId)

    await guildQueue.seek(seconds * 1000)

    await interaction.reply('Song time was changed')
  }
}

export { seek }
