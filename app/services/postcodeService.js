const internalLookup = require('./internalPostcodeLookup')
const freeLookup = require('./freePostcodeLookup')
const {isUndefined, isNull, map, chain} = require('lodash')

module.exports = function (postcode) {
  const addressLookup = isUndefined(internalLookup.token()) ? freeLookup : internalLookup
  return addressLookup.lookup(postcode)
    .then(addresses => map(addresses, addressArray => chain(addressArray)
      .filter(line => (!isUndefined(line) && !isNull(line) && (line.length > 0)))
      .join(', ')
      .value()))
}
