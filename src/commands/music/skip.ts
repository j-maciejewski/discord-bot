import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const skip: ICommand = {
  name: Commands.SKIP,
  description: 'Skip a song',
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.skip()

    await interaction.reply('Song was skipped!')
  }
}

export { skip }
