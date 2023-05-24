import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const resume: ICommand = {
  name: Commands.RESUME,
  description: 'Resume the player',
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.setPaused(false)

    await interaction.reply('Player was resumed!')
  }
}

export { resume }
