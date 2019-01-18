const svc = require('../services/modifyAnswerRouteService')

module.exports = function (router) {
  router.get(`/modify`, function (req, res) {
    const start = req.query.s
    const from = req.query.f
    const to = req.query.t
    console.log(`Set up redirect from ${from} to ${to} starting at ${start}`)
    svc.setRedirect(req.session, from, to)
    return res.redirect(`${start}`)
  })

  router.post('/*', function (req, res, next) {
    if (svc.isRedirectFrom(req.session, req.path)) {
      console.log(`Redirect activated on ${req.path}`)
      svc.activateRedirect(req.session)
    }
    return next()
  })

  router.get('/*', function (req, res, next) {
    if (svc.isRedirectDestination(req.session, req.path)) {
      console.log(`Redirect completed for ${req.path}`)
      svc.resetRedirect(req.session)
    } else if (!svc.isRedirectFrom(req.session, req.path) && svc.redirectActive(req.session)) {
      console.log(`Perform redirect to ${svc.getRedirectDestination(req.session)}`)
      return res.redirect(svc.getRedirectDestination(req.session))
    }
    return next()
  })
}
