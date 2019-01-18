module.exports = function (router) {
  router.post('/co-executors-journey/check-your-answers', function (req, res) {
    if (req.body.radioGroup === 'agree') {
      return res.redirect('/co-executors-journey/agree-check-your-answers')
    }
    return res.redirect('/co-executors-journey/disagree-check-your-answers')
  })

  router.post('/co-executors-journey/declaration', function (req, res) {
    if (req.body.coApplicantCorrect === 'agree') {
      return res.redirect('/co-executors-journey/agree-declaration')
    }
    return res.redirect('/co-executors-journey/disagree-declaration')
  })
}
