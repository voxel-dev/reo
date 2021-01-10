const { join, permissions } = require('@util')
require('dotenv').config()

const prefix = process.env.PREFIX

module.exports = async (client, message) => {
  if ((!message.content.startsWith(prefix) && message.channel.type !== 'dm') || message.author.bot) return

  const args = message.channel.type !== 'dm' ? message.content.slice(prefix.length).trim().split(/ +/) : message.content.trim().split(/ +/)

  let commandName = args.shift().toLowerCase()

  let command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command || command.parent) {
    return message.reply('do nyu have nyothing else to do-nya?')
  }

  if (command.isParent) {
    const parent = command

    if (args.length === 0) {
      return message.reply(`Please provide an argument. The available subcommands are: \`${join(parent.subCommands)}\`.`)
    }

    commandName = args.shift().toLowerCase()
    command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command || !parent.subCommands.includes(commandName)) {
      return message.reply(`Please provide a valid argument. The available subcommands are: \`${join(parent.subCommands)}\`.`)
    }
  }

  if (args[0] === '-h' || args[0] === '--hide') {
    args.shift()
    message.delete()
  }

  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply(`I can't execute the ${command.name} command inside DMs.`)
  }

  if (command.permissions) {
    if (!message.member.hasPermission(command.permissions)) {
      if (command.permissions.length === 1) {
        return message.reply(`You need the \`${permissions[command.permissions[0]]}\` permission for the \`${command.name}\` command to work.`)
      } else {
        return message.reply(`You need the following permissions for the \`${command.name}\` command to work: \`${join(command.permissions.map(perm => permissions[perm]))}\`.`)
      }
    }
  }

  /* if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}.`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.names[0]} ${command.usage}\``
    }

    return message.reply(reply)
  } */

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command!')
  }
}
