import { CacheType, ChatInputCommandInteraction } from 'discord.js'

export const shuffleScript = (interaction: ChatInputCommandInteraction<CacheType>) => {
  const { guildId, client } = interaction

  const guildQueue = client.player.getQueue(guildId)

  guildQueue.shuffle()
}
