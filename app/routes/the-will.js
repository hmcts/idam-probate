module.exports = function (router) {
  router.post('/the-will/will-date', function (req, res) {
    if (req.body.willDate === 'Yes') {
      res.redirect('codicils')
    } else {
      res.redirect('codicils')
    }
  })

  router.post('/the-will/codicils', function (req, res) {
    if (req.body.codicils === 'Yes') {
      res.redirect('codicils-number')
    } else {
      res.redirect('/tasklist/gds/index.html')
    }
  })

  router.post('/the-will/codicils-number', function (req, res) {
    res.redirect('/tasklist/gds/index.html')
  })

  router.post('/the-will/codicils-date', function (req, res) {
    res.redirect('/tasklist/gds/index.html')
  })
}
