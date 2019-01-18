const {forOwn, set} = require('lodash')

module.exports = function (router) {
  router.get('/test/set-session', function (req, res) {
    console.log('Setting sample data from file')
    const data = require('../data/manual-address-sample')
    forOwn(data, (v, k) => {
      set(req.session.data, k, v)
    })
    return res.redirect('session')
  })
}
