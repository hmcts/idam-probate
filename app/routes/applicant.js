const {get, set} = require('lodash')
const addressLookup = require('../services/postcodeService')

module.exports = function (router) {
  router.post('/applicant/other-executors', function (req, res) {
    if (req.body.otherExecutors === 'Yes') {
      res.redirect('/applicant/executor-name/2')
    } else {
      res.redirect('/deceased/name')
    }
  })

  router.post('/applicant/name', function (req, res) {
    req.session.data.applicantFirstName = req.body.applicantFirstName.trim()
    req.session.data.applicantLastName = req.body.applicantLastName.trim()
    req.session.data.applicantFullName = req.session.data.applicantFirstName + ' ' + req.session.data.applicantLastName

    res.redirect('/applicant/name-on-will')
  })

  router.post('/applicant/name-on-will', function (req, res) {
    if (req.body.applicantNameSameAsOnWill === 'Yes') {
      res.redirect('/applicant/phone-number')
    } else {
      res.redirect('/applicant/name-will')
    }
  })

  router.post('/applicant/name-will', function (req, res) {
    res.redirect('/applicant/reason-name-change')
  })

  router.post('/applicant/reason-name-change', function (req, res) {
     res.redirect('/applicant/phone-number')
  })

  router.post('/applicant/phone-number', function (req, res) {
    req.session.data.applicantPhoneNumber = req.body.applicantPhoneNumber
    res.redirect('/applicant/address/postcode')
  })

  router.post('/applicant/address/postcode', function (req, res) {
    set(req.session.data, 'applicant.home.street1', req.body.street1)
    set(req.session.data, 'applicant.home.street2', req.body.street2)
    set(req.session.data, 'applicant.home.street3', req.body.street3)
    set(req.session.data, 'applicant.home.town', req.body.town)
    set(req.session.data, 'applicant.home.county', req.body.county)
    set(req.session.data, 'applicant.home.postcode', req.body.postcode)

    res.redirect('/the-executors/how-many')
  })

  router.get('/applicant/address/enter-manually', function (req, res) {
    const title = 'What is your current address?'
    res.render('common/address/enter-manually', {
      title: title,
      address: get(req.session, 'applicant.home', {})
    })
  })

  router.get('/applicant/address/enter-manually', function (req, res) {
    const title = 'What is your current address?'
    res.render('common/address/enter-manually', {
      title: title,
      address: get(req.session, 'applicant.home', {})
    })
  })

  router.get('/applicant/address/postcode', function (req, res) {
    const title = 'What is your current address?'
    const postcode = get(req.session.data.applicant, 'home.postcode', '')
    addressLookup(postcode)
      .then((addresses) => {
        res.render('common/address/postcode', {
          postcode: postcode,
          instructionText: 'The grant of probate will be sent to this address.',
          title: title,
          outsideUKText: 'My address is outside the UK',
          addresses: addresses,
          address: get(req.session, 'applicant.home', {}),
          selectLabel: 'Select your address'
        })
      })
  })

  router.get('/applicant/address/abroad', function (req, res) {
    res.render('common/address/enter-abroad', {
      title: 'What is your current address?'
    })
  })

  router.post('/applicant/address/abroad', function (req, res) {
    set(req.session.data, 'applicant.home.street1', req.body.abroadAddress)
    set(req.session.data, 'applicant.home.street2', '')
    set(req.session.data, 'applicant.home.street3', '')
    set(req.session.data, 'applicant.home.town', '')
    set(req.session.data, 'applicant.home.county', '')
    set(req.session.data, 'applicant.home.postcode', '')

    res.redirect('/the-executors/how-many')
  })

  router.post('/applicant/address/abroad', function (req, res) {
    res.redirect('/the-executors/how-many')
  })
}
