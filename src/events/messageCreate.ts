import { Events } from 'discord.js'

import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const messageCreate: ClientEventHandler<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute: async (message) => {
    try {
      const { author } = message

      if (author.bot) return
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { message })
      }
    }
  },
}

export { messageCreate }
