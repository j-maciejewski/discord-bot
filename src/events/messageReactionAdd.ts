import { Events } from 'discord.js'

import { Users } from '../config'
import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const messageReactionAdd: ClientEventHandler<Events.MessageReactionAdd> = {
  name: Events.MessageReactionAdd,
  execute: async (reaction, user) => {
    try {
      if (!reaction) return

      const { client, emoji, message } = reaction

      if (user.id === Users.BORYS) {
        if (!emoji.id) {
          await message.react(emoji.name)
        } else {
          const reactionEmoji = client.emojis.cache.get(emoji.id)

          if (reactionEmoji) {
            await message.react(reactionEmoji)
          }
        }
      }

      if (message.author.id === Users.YUNNAH && (emoji.name === '🥶' || emoji.id)) {
        await reaction.remove()
      }

      if (user.id === Users.BIELEJ && Math.random() <= 0.33) {
        await reaction.remove()
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { reaction, user })
      }
    }
  }
}

export { messageReactionAdd }
