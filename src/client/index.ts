import { Player } from '@jadestudios/discord-music-player'
import { Client, type ClientOptions, Collection } from 'discord.js'

import { type ICommand } from '../types'

export class DiscordClient extends Client {
  constructor (options: ClientOptions) {
    super(options)

    this.commands = new Collection<string, ICommand>(
      Object.values(options.commands).map((command) => [command.name, command])
    )
    this.player = new Player(this, {
      leaveOnEmpty: true,
      leaveOnEnd: true
    })
  }
}
