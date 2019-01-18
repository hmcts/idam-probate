const express = require('express')
const {set} = require('lodash')
const router = express.Router()
const dataService = require('./services/dataService')
const redirectIntercept = require('./routes/redirectIntercept')
const fileNames = ['test', 'registration', 'screening-questions', 'applicant', 'postcodeLookup', 'deceased', 'the-executors', 'co-executors-journey', 'the-will', 'tasklist']

module.exports = router

redirectIntercept(router)

for (let name of fileNames) {
  let route = require(`./routes/${name}`)
  route(router)
}

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})

router.get('/declaration', function (req, res, next) {
  // console.log(`Getting declaration version for ${dataService.onlyApplyingCoExecutors(req.session.data).length} co-execs`)
  if (dataService.onlyApplyingCoExecutors(req.session.data).length > 0) {
    return res.redirect('declaration-lead-multiple')
  }
  return res.redirect('declaration-individual')
})

router.post('declaration-individual', function (req, res) {
  res.redirect('/tasklist/grant')
})

router.post('/declaration-lead-multiple', function (req, res, next) {
  // console.log(`Posted declaration version for ${dataService.onlyApplyingCoExecutors(req.session.data).length} co-execs`)
  if (req.session.reviewAndConfirmWaitingSeen === true) {
    return res.redirect('we-wont-notify-other-executor')
  }
  return res.redirect('we-will-notify-other-executors')
})

router.get('/documents', function (req, res) {
  res.render('documents', {
    renunc: JSON.stringify(req.session.data).indexOf('renunciation') !== -1
  })
})

// router.post('/documents/prepare-to-send-documents', function (req, res) {
//   res.redirect('/upload-docs/documents')
// })

// router.post('/upload-docs/documents', function (req, res) {
//   res.redirect('/pay/payment-breakdown')
// })

router.post('/documents/send-your-documents', function (req, res) {
  res.redirect('/thank-you')
})

router.post('/grant/copies-uk', function (req, res) {
  res.redirect('/grant/copies-overseas')
})

// router.post('/grant/assets-overseas', function (req, res) {
//   if (req.body.assetsOverseas === 'Yes') {
//     res.redirect('/grant/copies-overseas')
//   } else {
//     res.redirect('/grant/check-your-answers')
//   }
// })

router.post('/grant/copies', function (req, res) {
  res.redirect('/grant/check-your-answers')
})

router.post('/grant/copies-overseas', function (req, res) {
  res.redirect('/grant/check-your-answers')
})

router.post('/grant/copies-overseas', function (req, res) {
  res.redirect('/grant/check-your-answers')
})

router.get('/pay/payment-breakdown', function (req, res) {
  let currentFee = 215
  let docFee = 0.5
  let overThreashold = req.session.data.net205 >= 5000 || req.session.data.net207 >= 5000 || req.session.data.net400 >= 5000 || req.session.data.netValue >= 5000
  if (!overThreashold) {
    currentFee = 215
  }
  const ukGrant = req.session.data.ukGrant || 0
  const overseasGrant = req.session.data.overseasGrant || 0
  const totalDue = (ukGrant * docFee) + (overseasGrant * docFee) + currentFee
  const totalDueDisplay = (totalDue) === parseInt(totalDue) ? totalDue : totalDue.toFixed(2)
  set(req.session.data, 'total_due', totalDueDisplay)

  res.render('pay/payment-breakdown', {
    fee_payable: overThreashold,
    application_fee: currentFee,
    ukGrantFee: (docFee * ukGrant) === parseInt(docFee * ukGrant) ? docFee * ukGrant : (docFee * ukGrant).toFixed(2),
    overseasGrantFee: (docFee * overseasGrant) === parseInt(docFee * overseasGrant) ? docFee * overseasGrant : (docFee * overseasGrant).toFixed(2),
    totalDue: (totalDue) === parseInt(totalDue) ? totalDue : totalDue.toFixed(2)
  })
})

// lab prep question
router.post('/lab-prep/names', function (req, res) {
  res.redirect('/emails/invitation')
})
