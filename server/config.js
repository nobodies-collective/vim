import { Meteor } from 'meteor/meteor'

export const config = {
  noonerHuntApi: process.env.NOONER_HUNT_API,
  noonerHuntKey: process.env.NOONER_HUNT_KEY,
  // quicketApiKey: process.env.QUICKET_API_KEY,
  // quicketUserToken: process.env.QUICKET_USER_TOKEN,
  // quicketEventId: process.env.QUICKET_EVENT_ID,
}
let envJson = {}
if (!Meteor.isProduction) {
  try {
    // eslint-disable-next-line global-require
    envJson = require('./env.json')
  } catch (e) {
    console.warn('server/env.json not found — copy server/env.example to server/env.json for local config')
  }
}

export const devConfig = Meteor.isProduction ? {} : { ...envJson.devConfig || {} }

if (Meteor.isProduction) {
  Object.keys(config).forEach((key) => {
    if (!config[key]) console.warn(`Config value ${key} is not set. Check your env vars`)
  })
} else {
  Object.keys(config).forEach((key) => {
    if (!envJson[key]) console.warn(`Config value ${key} is not set. Check your server/env.json`)
    config[key] = envJson[key]
  })
}
