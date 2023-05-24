import { type ChatInputCommandInteraction, GuildMember } from 'discord.js'
import { getVoiceConnection } from '@discordjs/voice'

const musicCommandValidator = (interaction: ChatInputCommandInteraction): { error: string | null } => {
  const { guildId, client, member } = interaction

  if (!(member instanceof GuildMember)) return

  if (!client.player.hasQueue(guildId)) {
    return { error: 'No song is currently playing' }
  }

  const botConnection = getVoiceConnection(guildId)
  const botVoiceChannelId = botConnection.joinConfig.channelId

  const userVoiceChannelId = member.voice.channel.id

  if (botVoiceChannelId !== userVoiceChannelId) {
    return { error: 'No song is currently playing' }
  }

  return { error: null }
}

export { musicCommandValidator }
