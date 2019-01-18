const postcodeService = require('../services/postcodeService')
const {get} = require('lodash')

module.exports = function (router) {
  router.get('/postcode-lookup', (req, res) => {
    console.log(`Postcode lookup for ${req.query.postcode}`)
    return postcodeService(get(req.query, 'postcode', ''))
      .then((addresses) => res.send(JSON.stringify(addresses)))
      .catch((err) => {
        console.log(err)
        return res.status(500)
      })
  })
}
