const request = require('request-promise-native')
const sampleAddresses = require('./postcodeLookupMockData.json')

;(function () {
  const Url = function (url) {
    this.url = url
    this.params = []
  }

  Url.prototype.withParam = function (param, value) {
    if (typeof value !== 'undefined') {
      this.params.push({
        param: param,
        value: value
      })
    }
    return this
  }

  Url.prototype.toString = function () {
    var str = this.url
    var splitter = '?'
    this.params.forEach(function (item) {
      str += splitter + item.param + '=' + item.value
      splitter = '&'
    })
    return str
  }

  const apiKey = '0jscCk4u20qG5-kulsKABA11112'

  const addressLookup = module.exports = {
    key: function () {
      return apiKey
    },
    url: function (postcode) {
      return new Url(`https://api.getAddress.io/find/${postcode}`)
        .withParam('api-key', addressLookup.key())
        .withParam('format', true)
        .withParam('sort', true)
        .toString()
    },
    lookup: function (postcode) {
      if (postcode.length > 0) {
        const url = addressLookup.url(postcode)
        console.log(`Getting ${url}`)
        return request(url)
          .then((result) => {
            return JSON.parse(result).addresses
          })
      }
      return new Promise((resolve, reject) => resolve([]))
    },
    fakeLookup: (postcode) => {
      return new Promise((resolve, reject) => resolve((sampleAddresses)))
    }
  }

  return module
})()
