const request = require('request-promise-native')
const {map, chain, isNull, toLower, upperFirst} = require('lodash')
const mockData = require('./postcodeLookupMockData.json')

const addressFields = [
  'organisation_name',
  'department_name',
  'po_box_number',
  'building_name',
  'sub_building_name',
  'building_number',
  'thoroughfare_name',
  'dependent_thoroughfare_name',
  'dependent_locality',
  'double_dependent_locality',
  'post_town'
]

const token = () => {
  return process.env.POST_CODE_ACCESS_TOKEN
}

module.exports = {
  token: token,
  lookup: (postcode) => {
    if (token()) {
      return request({
        url: `https://postcodeinfo.service.justice.gov.uk/addresses/?postcode=${postcode}`,
        headers: {'Authorization': process.env.POST_CODE_ACCESS_TOKEN}
      })
        .then(data => map(JSON.parse(data), address => chain(address)
          .pick(addressFields)
          .values()
          .filter(l => !isNull(l))
          .map(line => chain(line).words()
            .map(w => upperFirst(toLower(w.toString())))
            .join(' ').value())
          .concat(postcode)
          .value())
        )
    }
    return (new Promise((resolve, reject) => resolve(mockData)))
  }
}
