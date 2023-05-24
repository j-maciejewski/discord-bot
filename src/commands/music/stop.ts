import { Commands } from '../../consts'
import { type ICommand } from '../../types'
import { musicCommandValidator } from '../../utils'

const stop: ICommand = {
  name: Commands.STOP,
  description: 'Stop a song',
  run: async (interaction) => {
    const { error: validatorError } = musicCommandValidator(interaction)

    if (validatorError) {
      await interaction.reply({ ephemeral: true, content: validatorError })
    }

    const { guildId, client } = interaction

    const guildQueue = client.player.getQueue(guildId)

    guildQueue.stop()

    await interaction.reply('Player was stopped!')
  }
}

export { stop }
