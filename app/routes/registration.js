module.exports = function (router) {
  router.post('/registration/index', function (req, res) {
    res.redirect('verify-email')
  })
}
