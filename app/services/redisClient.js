const redis = require('redis')
const log4js = require('log4js')
const logger = log4js.getLogger()

const redisUrl = process.env.REDISCLOUD_URL || 'redis://localhost:6379'
const redisClient = redis.createClient(redisUrl)

redisClient.on('error', function (err) {
  logger.error('redis error: ' + err)
})

module.exports = redisClient
