module.exports = function (router) {
  router.get('/tasklist/review-and-confirm-waiting', function (req, res, next) {
    console.log('Review and confirm waiting')
    req.session.reviewAndConfirmWaitingSeen = true
    next()
  })
}
