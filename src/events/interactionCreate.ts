import { Events } from 'discord.js'

import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const interactionCreate: ClientEventHandler<Events.InteractionCreate> = {
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return

      const command = interaction.client.commands.get(interaction.commandName)

      if (!command) {
        await interaction.reply({ content: 'Command you requested help for does not exist!', ephemeral: true })
        console.error(`No command matching ${interaction.commandName} was found.`)
        return
      }

      await command.run(interaction)
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { interaction })
      }
    }
  }
}

export { interactionCreate }
