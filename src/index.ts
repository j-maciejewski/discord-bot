import * as dotenv from 'dotenv'
import { GatewayIntentBits, REST, Routes } from 'discord.js'

import * as commands from './commands'
import * as events from './events'
import { playerListenersSetup } from './utils'
import { DiscordClient } from './client'

dotenv.config()

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: Object.values(commands) })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

const client = new DiscordClient({
  commands: Object.values(commands),
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ]
})

playerListenersSetup(client)

Object.values(events).forEach(event => {
  client.on(event.name, (...args) => {
    // @ts-expect-error
    event.execute(...args)
  })
})

client.login(process.env.TOKEN)
