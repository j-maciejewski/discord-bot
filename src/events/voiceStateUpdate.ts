import { join } from 'path'

import { Events } from 'discord.js'
import { AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel } from '@discordjs/voice'

import { Users } from '../config'
import { type ClientEventHandler } from '../types'
import { logError } from '../utils'

const voiceStateUpdate: ClientEventHandler<Events.VoiceStateUpdate> = {
  name: Events.VoiceStateUpdate,
  execute: async (oldState, newState) => {
    if (newState.id !== Users.JACA) return

    try {
      const newUserChannel = newState.channelId
      const oldUserChannel = oldState.channelId

      if (newUserChannel && newUserChannel !== oldUserChannel && newState.channel.isVoiceBased()) {
        const player = createAudioPlayer()

        const connection = joinVoiceChannel({
          channelId: newState.channelId,
          guildId: newState.guild.id,
          adapterCreator: newState.guild.voiceAdapterCreator
        })

        connection.subscribe(player)

        const filePath = join(__dirname, '..', '..', 'assets', 'audio', 'bing-chilling.mp3')

        const resource = createAudioResource(filePath)

        player.play(resource)

        player.on(AudioPlayerStatus.Idle, () => {
          player.stop()
          connection.destroy()
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message, { oldState, newState })
      }
    }
  }
}

export { voiceStateUpdate }
