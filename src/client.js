const { readdirSync, statSync } = require('fs')
const { Client, Intents, Collection } = require('discord.js')
require('dotenv').config({ path: '../.env' })

class Reo extends Client {
  constructor () {
    super({ ws: { intents: Intents.ALL }, messageCacheLifetime: 180, messageCacheMaxSize: 200, messageEditHistoryMaxSize: 200, messageSweepInterval: 180 })

    this.commands = new Collection()
    this.events = new Collection()

    this.commandFiles = []
    this.eventFiles = []
  }

  getFiles (directory, files) {
    readdirSync(directory).forEach(folder => {
      const folderFiles = readdirSync(`${directory}/${folder}`).filter(file => file.endsWith('.js') || statSync(`${directory}/${folder}/${file}`).isDirectory())
      folderFiles.forEach(file => {
        files.push([folder, file])
      })
    })
  }

  start () {
    this.getFiles('./commands', this.commandFiles)
    this.commandFiles.forEach(file => {
      if (statSync(`./commands/${file[0]}/${file[1]}`).isDirectory()) {
        const parentCommand = { name: file[1], isParent: true, subCommands: [] }
        const subCommands = readdirSync(`./commands/${file[0]}/${file[1]}`).filter(file => file.endsWith('.js'))
        subCommands.forEach(sub => {
          const subCommand = require(`./commands/${file[0]}/${file[1]}/${sub}`)
          subCommand.category = file[0]
          subCommand.name = sub.slice(0, -3)
          subCommand.parent = file[1]
          parentCommand.subCommands.push(subCommand.name)
          this.commands.set(subCommand.name, subCommand)
        })

        this.commands.set(parentCommand.name, parentCommand)
        return
      }

      const command = require(`./commands/${file[0]}/${file[1]}`)
      command.category = file[0]
      command.name = file[1].slice(0, -3)
      this.commands.set(command.name, command)
    })

    this.getFiles('./events', this.eventFiles)
    this.eventFiles.forEach(file => {
      const event = require(`./events/${file[0]}/${file[1]}`)
      this.events.set(file[0], event)
      this.on(file[0], event.bind(null, this))
      delete require.cache[require.resolve(`./events/${file[0]}/${file[1]}`)]
    })

    super.login()
  }
}

module.exports = Reo
