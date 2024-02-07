import { CacheType, ChatInputCommandInteraction } from 'discord.js'

export const skipScript = async (interaction: ChatInputCommandInteraction<CacheType>) => {
  const { guildId, client } = interaction

  const guildQueue = client.player.getQueue(guildId)

  guildQueue.skip()
}
