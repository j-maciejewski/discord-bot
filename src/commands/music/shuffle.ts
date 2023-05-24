import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const shuffle: ICommand = {
  name: Commands.SHUFFLE,
  description: 'Shuffle playlist',
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.shuffle()

    await interaction.reply('Queue was shuffled!')
  }
}

export { shuffle }
