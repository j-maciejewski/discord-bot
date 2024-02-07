import { type Player } from '@jadestudios/discord-music-player'
import {
  type ApplicationCommandOption,
  type ChatInputCommandInteraction,
  type ClientEvents,
  type Collection,
} from 'discord.js'

import { highEloTiers, type Commands, lowEloRanks, lowEloTiers } from './consts'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, ICommand>
    player: Player
  }

  interface ClientOptions {
    commands: ICommand[]
  }
}

type LowEloTiers = (typeof lowEloTiers)[number]
type LowEloRanks = (typeof lowEloRanks)[number]
type HighEloTiers = (typeof highEloTiers)[number]

type LeagueStatus = {
  tier: LowEloTiers | HighEloTiers
  rank: LowEloRanks
  currentLP: number
  totalLP: number
  miniSeries: string | null
  wins: number
  losses: number
}

interface ClientEventHandler<T extends keyof ClientEvents> {
  name: T
  execute: (...args: ClientEvents[T]) => void | Promise<void>
}

interface ICommand {
  name: Commands
  description: string
  options?: ApplicationCommandOption[]
  run: (interaction: ChatInputCommandInteraction) => Promise<void>
}

interface LeagueRank {
  summonerId: string
  queueType: string
  tier: LowEloTiers | HighEloTiers
  rank: LowEloRanks
  leaguePoints: number
  wins: number
  losses: number
  miniSeries?: {
    wins: number
    losses: number
    progress: string
  }
}

interface LeagueMatch {
  metadata: {
    matchId: string
  }
  info: {
    gameId: number
    gameStartTimestamp: number
    gameEndTimestamp: number
    participants: Array<{
      puuid: string
      summonerName: string
      championName: string
      kills: number
      deaths: number
      assists: number
      win: boolean
      item0: number
      item1: number
      item2: number
      item3: number
      item4: number
      item5: number
      item6: number
      summoner1Id: number
      summoner2Id: number
      totalDamageDealtToChampions: number
      teamId: number
    }>
  }
}

interface FormattedLeagueMatch {
  gameId: number
  matchId: string
  gameStartTimestamp: number
  gameEndTimestamp: number
  gameLength: string
  win: boolean
  player: FullPlayerData
  premades: PlayerData[]
  totalDamageInTeam: number
}

interface LeagueSpell {
  id: string
  key: string
  name: string
}

interface PlayerData {
  summonerName: string
  championName: string
  kills: number
  deaths: number
  assists: number
}

interface FullPlayerData extends PlayerData {
  items: number[]
  summoners: number[]
  damageDealt: number
}
