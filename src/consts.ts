export const lowEloTiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'] as const
export const lowEloRanks = ['I', 'II', 'III', 'IV'] as const
export const highEloTiers = ['MASTER', 'GRANDMASTER', 'CHALLENGER'] as const

export enum Commands {
  // General commands
  PING = 'ping',

  // Music bot commands
  LOOP = 'loop',
  PAUSE = 'pause',
  PLAY = 'play',
  PLAYLIST = 'playlist',
  QUEUE = 'queue',
  REMOVE = 'remove',
  RESUME = 'resume',
  SEEK = 'seek',
  SHUFFLE = 'shuffle',
  SKIP = 'skip',
  STOP = 'stop',
}
