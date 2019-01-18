const {get, set, unset} = require('lodash')
const addressLookup = require('../services/postcodeService')

module.exports = function (router) {
  router.post('/the-executors/how-many', function (req, res) {
    req.session.data.numberOfExecutors = parseInt(get(req.session.data, 'numberOfExecutors', 0))
    res.redirect('names')
  })

  router.post('/the-executors/names', function (req, res) {
    switch (req.session.data.numberOfExecutors) {
      case 0:
        res.redirect('how-many')
        break
      default:
        res.redirect('/the-executors/alive')
    }
  })

  // other executors
  router.get('/the-executors/alive', function (req, res, next) {
    switch (req.session.data.numberOfExecutors) {
      case 0:
        res.redirect('how-many')
        break
      case 1:
        set(req.session.data, 'allExecutorsAlive', 'Yes')
        res.redirect('contact-details')
        break
      default:
        next()
    }
  })

  router.post('/the-executors/alive', function (req, res) {
    if (req.body.allExecutorsAlive === 'Yes') {
      res.redirect('/the-executors/will-any-other-execs-be-dealing-with-the-estate')
    } else {
      res.redirect('/the-executors/who-is-alive')
    }
  })

  router.post('/the-executors/will-any-other-execs-be-dealing-with-the-estate', function (req, res) {
    if (req.body.anyOtherDealing === 'Yes') {
      res.redirect('/the-executors/who-will-administer-estate')
    } else {
      res.redirect('/the-executors/remaining-executors')
    }
  })

  router.post('/the-executors/who-is-alive', function (req, res) {
    set(req.session.data, `executorIsAlive0`, true) // The applicant is always alive
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) { // Loop starting from 1 instead of zero to account for line above
      let value = (get(req.body, `executorIsAlive${i}`)[1] !== 'false')
      set(req.session.data, `executorIsAlive${i}`, value)
    }
    res.redirect('date-of-death')
  })

  router.get('/the-executors/date-of-death', function (req, res, next) {
    const executorsWhoDied = []
    const executorToEdit = get(req.session.data, 'currentExecutorToEdit', 0)
    for (let i = 0; i <= req.session.data.numberOfExecutors - 1; i++) {
      if (get(req.session.data, `executorIsAlive${i}`, false) === false) {
        if (i >= executorToEdit) {
          executorsWhoDied.push(i)
        }
      }
    }
    if (executorsWhoDied.length > 0) {
      req.session.data.currentExecutorToEdit = executorsWhoDied[0]
      return res.render('the-executors/date-of-death', {
        data: req.session.data
      })
    }
    return res.redirect('will-any-other-execs-be-dealing-with-the-estate')
  })

  router.post('/the-executors/date-of-death', function (req, res) {
    const executorsWhoDied = []
    for (let i = 0; i <= req.session.data.numberOfExecutors - 1; i++) {
      if (get(req.session.data, `executorIsAlive${i}`, false) === false) {
        if (i > req.session.data.currentExecutorToEdit) {
          executorsWhoDied.push(i)
        }
      }
    }
    if (executorsWhoDied.length > 0) {
      req.session.data.currentExecutorToEdit = executorsWhoDied[0]
      return res.redirect(`date-of-death`)
    }
    unset(req.session.data, 'currentExecutorToEdit')
    return res.redirect('will-any-other-execs-be-dealing-with-the-estate')
  })

  router.post('/the-executors/who-will-administer-estate', function (req, res) {
    Object.keys(req.body).forEach(function (key) {
      if (req.body[key][1] === 'true') {
        req.session.data[key] = true
      } else {
        req.session.data[key] = false
      }

      req.session.data.manageEstate0 = true // the applicant is always dealing with the probate
    })

    res.redirect('name-changed')
  })

  router.post('/the-executors/name-changed', function (req, res) {
    if (req.body.executorsNameChanged === 'Yes') {
      res.redirect('/the-executors/name-changed-who')
    } else {
      res.redirect('contact-details')
    }
  })

  router.post('/the-executors/name-changed-who', function (req, res) {
    Object.keys(req.body).forEach(function (key, value) {
      if (req.body[key][1] === 'true') {
        req.session.data[key] = true
      } else {
        req.session.data[key] = false
      }

      if (!req.session.data.currentExecutorToEdit && req.session.data[key]) {
        const executorToEdit = get(req.session.data, 'currentExecutorToEdit', value)
        set(req.session.data, `currentExecutorToEdit`, executorToEdit + 1)
      }
    })

    res.redirect('/the-executors/name-changed-current-name')
  })

  router.get('/the-executors/name-changed-current-name', function (req, res) {
    const additionalExecutorsApplying = []
    const executorToEdit = get(req.session.data, 'currentExecutorToEdit', 0)
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) {
      if (get(req.session.data, `executorNameChanged${i}`, false) === true) {
        if (i >= executorToEdit) {
          additionalExecutorsApplying.push(i)
        }
      }
    }
    if (additionalExecutorsApplying.length > 0) {
      req.session.data.currentExecutorToEdit = additionalExecutorsApplying[0]

      return res.render('the-executors/name-changed-current-name', {
        data: req.session.data
      })
    }
  })

  router.post('/the-executors/name-changed-current-name', function (req, res) {
    res.redirect('/the-executors/name-changed-reason')
  })

  router.post('/the-executors/name-changed-reason', function (req, res) {
    const executorToEdit = get(req.session.data, 'currentExecutorToEdit', 0)
    if (req.session.data[`executorNameChangeReasonOther${executorToEdit}`] === '') {
      unset(req.session.data, `executorNameChangeReasonOther${executorToEdit}`)
    }
    res.redirect('/the-executors/contact-details')
  })

  router.get('/the-executors/contact-details', function (req, res, next) {
    const additionalExecutorsApplying = []
    const executorToEdit = get(req.session.data, 'currentExecutorToEdit', 0)
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) {
      if (get(req.session.data, `manageEstate${i}`, false) === true) {
        if (i >= executorToEdit) {
          additionalExecutorsApplying.push(i)
        }
      }
    }
    if (additionalExecutorsApplying.length > 0) {
      req.session.data.currentExecutorToEdit = additionalExecutorsApplying[0]
      return res.render('the-executors/contact-details', {
        data: req.session.data
      })
    }
    return res.redirect('remaining-executors')
  })

  router.post('/the-executors/contact-details', function (req, res) {
    return res.redirect('address')
  })

  const getExecutorName = (req) => {
    const currentFirstName = get(req.session.data, `executorCurrentFirstName${req.session.data.currentExecutorToEdit}`, '[executorCurrentFirstName]')
    const currentLastName = get(req.session.data, `executorCurrentLastName${req.session.data.currentExecutorToEdit}`, '[executorCurrentLastName]')
    const currentFullName = currentFirstName + ' ' + currentLastName
    return (req.session.data.executorsNameChanged !== 'Yes' &&
      currentFullName !== '[executorCurrentFirstName] [executorCurrentLastName]') ?
      get(req.session.data, `executorName${req.session.data.currentExecutorToEdit}`, '[executorName]') :
      currentFullName
  }

  const nextExecutorDetailsOrNextStep = (req, res) => {
    const additionalExecutorsApplying = []
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) {
      if (get(req.session.data, `manageEstate${i}`, false) === true) {
        if (i > req.session.data.currentExecutorToEdit) {
          additionalExecutorsApplying.push(i)
        }
      }
    }

    if (additionalExecutorsApplying.length > 0) {
        req.session.data.currentExecutorToEdit = additionalExecutorsApplying[0]

        if (req.session.data.executorsNameChanged === 'Yes') {
            return res.redirect(`name-changed-current-name`)
        }

        return res.redirect(`contact-details`)
    }
    unset(req.session.data, 'currentExecutorToEdit')
    return res.redirect('remaining-executors')
  }

  router.get('/the-executors/address', function (req, res) {
    const title = `What is ${getExecutorName(req)}'s permanent address?`
    const postcode = get(req.session.data, `executorPostcode${req.session.data.currentExecutorToEdit}`, '')
    addressLookup(postcode)
      .then((addresses) => {
        return res.render('common/address/postcode', {
          postcode: postcode,
          instructionText: 'This will be printed on the grant of probate.',
          title: title,
          outsideUKText: 'Their address is outside the UK',
          addresses: addresses,
          address: get(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}`, {}),
          selectLabel: 'Select their address'
        })
      })
  })

  router.post('/the-executors/address', function (req, res) {
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street1`, req.body.street1)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street2`, req.body.street2)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street3`, req.body.street3)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.town`, req.body.town)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.county`, req.body.county)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.postcode`, req.body.postcode)

    return nextExecutorDetailsOrNextStep(req, res)
  })

  router.get('/the-executors/abroad', function (req, res) {
    res.render('common/address/enter-abroad', {
      title: `What is ${getExecutorName(req)}'s permanent address?`
    })
  })

  router.post('/the-executors/abroad', function (req, res) {
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street1`, req.body.abroadAddress)
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street2`, '')
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.street3`, '')
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.town`, '')
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.county`, '')
    set(req.session.data, `executorAddress${req.session.data.currentExecutorToEdit}.postcode`, '')

    return nextExecutorDetailsOrNextStep(req, res)
  })

  router.get('/the-executors/remaining-executors', function (req, res, next) {
    const executorsNotApplying = []
    const executorToEdit = get(req.session.data, 'currentExecutorToEdit', 0)
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) {
      // (If not managing the estate AND not the applicant) AND (all executors are alive OR this executor is alive)
      if (((get(req.session.data, `manageEstate${i}`, false) !== true) && (get(req.session.data, 'applicantFullName') !== get(req.session.data, `executorName${i}`))) && ((get(req.session.data, 'allExecutorsAlive', 'Yes') === 'Yes') || (get(req.session.data, `executorIsAlive${i}`, false) === true))) {
        if (i >= executorToEdit) {
          executorsNotApplying.push(i)
        }
      }
    }
    if (executorsNotApplying.length > 0) {
      req.session.data.currentExecutorToEdit = executorsNotApplying[0]
      return res.render('the-executors/remaining-executors', {
        data: req.session.data
      })
    }
    return res.redirect('/tasklist/review-and-confirm')
  })

  const handleNextRemainingExecutor = (req, res) => {
    const executorsNotApplying = []
    for (let i = 1; i <= req.session.data.numberOfExecutors - 1; i++) {
      // (If not managing the estate AND not the applicant) AND (all executors are alive OR this executor is alive)
      if (((get(req.session.data, `manageEstate${i}`, false) !== true) && (get(req.session.data, 'applicantFullName') !== get(req.session.data, `executorName${i}`))) && ((get(req.session.data, 'allExecutorsAlive', 'Yes') === 'Yes') || (get(req.session.data, `executorIsAlive${i}`, false) === true))) {
        if (i > req.session.data.currentExecutorToEdit) {
          executorsNotApplying.push(i)
        }
      }
    }
    if (executorsNotApplying > 0) {
      req.session.data.currentExecutorToEdit = executorsNotApplying[0]
      return res.redirect(`remaining-executors`)
    }
    unset(req.session.data, 'currentExecutorToEdit')
    return res.redirect('/tasklist/review-and-confirm')
  }

  router.post('/the-executors/remaining-executors', function (req, res) {
    switch (get(req.body, `notApplyingReason${req.session.data['currentExecutorToEdit']}`)) {
      case 'reserve':
        return res.redirect('informed-executors-reserving-power')
      default:
        return handleNextRemainingExecutor(req, res)
    }
  })

  router.post('/the-executors/informed-executors-reserving-power', function (req, res) {
    return handleNextRemainingExecutor(req, res)
  })

  router.post('/the-executors/power-reserved', function (req, res) {
    req.session.executors.reservingPower = req.body.executorsReservingPower
    let count = 0
    if (req.body.executorsReservingPower) {
      count = req.body.executorsReservingPower.length
    }
    req.session.executors.numberOfExecutorsReservingPower = count
    res.redirect('informed-executors-reserving-power')
  })

  router.post('/the-executors/died', function (req, res) {
    res.redirect('renounced')
  })

  router.post('/the-executors/renounced', function (req, res) {
    res.redirect('remaining-executors')
  })

}
