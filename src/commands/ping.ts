import { Commands } from '../consts'
import { type ICommand } from '../types'

const ping: ICommand = {
  name: Commands.PING,
  description: 'Replies with Pong!',
  run: async (interaction) => {
    await interaction.reply('Pong!')
  }
}

export { ping }
