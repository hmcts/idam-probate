const session = require('express-session')
const RedisStore = require('connect-redis')(session)

const secret = process.env.SECRET || 'setasecretyoufool'
const env = (process.env.NODE_ENV || 'development').toLowerCase()

const sessions = module.exports = {
  prod: () => {
    if (env === 'development') {
      return sessions.inmemory()
    } else {
      return sessions.redis()
    }
  },
  redis: () => {
    const redisClient = require('./redisClient')
    let store = new RedisStore({
      client: redisClient
    })
    return session({
      secret: secret,
      store: store,
      resave: false,
      saveUninitialized: true,
      cookie: {secure: false}
    })
  },
  inmemory: () => {
    return session({
      secret: secret,
      resave: false,
      saveUninitialized: true,
      cookie: {secure: false}
    })
  }
}
