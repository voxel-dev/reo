function join (arr) {
  if (arr.length === 1) return arr[0]
  const copy = [...arr]
  copy.sort()
  const last = copy.pop()
  return copy.join(', ') + ' and ' + last
}

const permissions = {
  ADMINISTRATOR: 'administrator',
  VIEW_AUDIT_LOG: 'view audit log',
  MANAGE_GUILD: 'manage server',
  MANAGE_ROLES: 'manage roles',
  MANAGE_CHANNELS: 'manage channels',
  KICK_MEMBERS: 'kick members',
  BAN_MEMBERS: 'ban members',
  CREATE_INSTANT_INVITE: 'create instant invite',
  CHANGE_NICKNAME: 'change nickname',
  MANAGE_NICKNAMES: 'manage nicknames',
  MANAGE_EMOJIS: 'manage emojis',
  MANAGE_WEBHOOKS: 'manage webhooks',
  VIEW_CHANNEL: 'read text channels and see voice channels',
  SEND_MESSAGES: 'send messages',
  SEND_TTS_MESSAGES: 'send TTS messages',
  MANAGE_MESSAGES: 'manage messages',
  EMBED_LINKS: 'embed links',
  ATTACH_FILES: 'attach files',
  READ_MESSAGE_HISTORY: 'read message history',
  MENTION_EVERYONE: 'mention everyone',
  USE_EXTERNAL_EMOJIS: 'use external emojis',
  ADD_REACTIONS: 'add reactions',
  CONNECT: 'connect',
  SPEAK: 'speak',
  MUTE_MEMBERS: 'mute members',
  DEAFEN_MEMBERS: 'deafen members',
  MOVE_MEMBERS: 'move members',
  USE_VAD: 'use voice activity'
}

module.exports = {
  join,
  permissions
}
