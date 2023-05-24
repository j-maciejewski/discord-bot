import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const pause: ICommand = {
  name: Commands.PAUSE,
  description: 'Pause the player',
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.setPaused(true)

    await interaction.reply('Player was paused!')
  }
}

export { pause }
