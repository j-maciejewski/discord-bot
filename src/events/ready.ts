import { ActivityType, Events, type TextChannel } from 'discord.js'

import { LeagueStatus, type ClientEventHandler } from '../types'
import { ONE_MINUTE, createEmbed, getLastMatch, getRankMessage, getStatus, logError } from '../utils'
import { CHANNEL_ID, DISPLAY_LEAGUE_STATUS, GUILD_ID, LeaguePUUID } from '../config'

const ready: ClientEventHandler<Events.ClientReady> = {
  name: Events.ClientReady,
  execute: async (client) => {
    try {
      const guild = client.guilds.cache.get(GUILD_ID)
      const channel = (await guild.channels.fetch(CHANNEL_ID)) as TextChannel

      if (DISPLAY_LEAGUE_STATUS) {
        let cachedStatus: LeagueStatus | null = null

        const setDescription = async () => {
          const leagueStatus = await getStatus()

          if (!leagueStatus) return

          cachedStatus = leagueStatus

          const rankMessage = getRankMessage(leagueStatus)

          client.user.setPresence({
            activities: [{ name: `Keelingur: ${rankMessage}`, type: ActivityType.Playing }],
            status: 'online',
          })
        }

        setDescription()

        const lastMatchInterval = setInterval(() => {
          ;(async () => {
            try {
              const lastMatch = await getLastMatch(LeaguePUUID.KEELINGUR)
              const newStatus = await getStatus()

              if (
                !lastMatch ||
                !newStatus ||
                (cachedStatus.wins === newStatus.wins && cachedStatus.losses === newStatus.losses)
              )
                return

              const rankMessage = getRankMessage(newStatus)

              client.user.setPresence({
                activities: [{ name: `Keelingur: ${rankMessage}`, type: ActivityType.Playing }],
                status: 'online',
              })

              const embedOptions = await createEmbed(lastMatch, cachedStatus, newStatus)

              cachedStatus = newStatus

              await channel.send(embedOptions)
            } catch (error: unknown) {
              if (error instanceof Error && error.message === 'Forbidden') {
                clearInterval(lastMatchInterval)
              }
            }
          })()
        }, ONE_MINUTE)
      }

      console.log(`${client.user.tag} has logged in. 🎶`)
    } catch (error: unknown) {
      if (error instanceof Error) {
        logError(error.message)
      }
    }
  },
}

export { ready }
