import { Events, TextChannel } from 'discord.js'

import { Emojis, Stickers, Users } from '../config'
import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const messageCreate: ClientEventHandler<Events.MessageCreate> = {
  name: Events.MessageCreate,
  execute: async (message) => {
    try {
      const { author, content, guild } = message

      if (author.bot) return

      if (message.reference) {
        const referencedChannel = await guild.channels.fetch(message.reference.channelId) as TextChannel
        const referencedMessage = await referencedChannel.messages.fetch(message.reference.messageId)

        if (referencedMessage.author.id ===  Users.YUNNAH && message.content.includes('🥶')) {
          await message.delete()
        }
      }

      if (author.id === Users.BIELEJ && Math.random() <= 0.1) {
        await message.react('🥶')
      }

      if (content.toLowerCase().replace(/\s/g, '').includes('arek')) {
        const pepeHandsEmoji = await guild.emojis.fetch(Emojis.PEPE_HANDS)
        const sadCatEmoji = await guild.emojis.fetch(Emojis.SAD_CAT)

        const arekSticker = await guild.stickers.fetch(Stickers.AREK_1)
        // const iziSticker = await guild.stickers.fetch(Stickers.IZI_1)

        const daysCount = Math.ceil(
          (new Date().getTime() - new Date('11/27/2021').getTime()) / (1000 * 3600 * 24)
        )
        const replyMessage = `Arka już z nami nie ma: ${daysCount} dni...\nOstatnio widziany dnia: 2021-11-27 ${sadCatEmoji}\nArek proszę wruc ${pepeHandsEmoji}`

        await message.reply({ content: replyMessage, stickers: [arekSticker] })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { message })
      }
    }
  }
}

export { messageCreate }
