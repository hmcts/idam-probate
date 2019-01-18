const request = require('co-request')
const log4js = require('log4js')
const logger = log4js.getLogger()

const apiServiceUrl = process.env.API_SERVICE_URL

const submitApplicationService = {

  submit: function* (petitionerDetails) {
    const inputData = {
      firstName: petitionerDetails.currentFirstName,
      lastName: petitionerDetails.currentLastName,
      email: petitionerDetails.email,
      phoneNumber: petitionerDetails.phoneNumber
    }

    let result = yield request({
      uri: apiServiceUrl,
      method: 'POST',
      json: true,
      body: inputData
    })

    logger.info('call to petition store service: ', result.body)
    return result.statusCode === 200
  }
}

module.exports = submitApplicationService
