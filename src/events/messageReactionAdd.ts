import { Events } from 'discord.js'

import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const messageReactionAdd: ClientEventHandler<Events.MessageReactionAdd> = {
  name: Events.MessageReactionAdd,
  execute: async (reaction, user) => {
    try {
      if (!reaction) return
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { reaction, user })
      }
    }
  },
}

export { messageReactionAdd }
