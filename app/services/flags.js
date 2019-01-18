const Step = require('app/steps/Step')

function getFlag (req, name, defaultVal, parse) {
  if ('session' in req &&
      'Flags' in req.session &&
      name in req.session.Flags) {
    return parse(req.session.Flags[name])
  } else {
    return defaultVal
  }
}

module.exports = class Flags extends Step {
  get url () { return '/flags' }

  next (req, res) {
    res.redirect('/')
  }

  static middleware (req, res, next) {
    const bool = (name, defaultVal) => getFlag(
      req, name, defaultVal, (str) => str === 'true'
    )

    const flags = {
      validation: bool('validation', true)
    }

    req.flags = flags
    res.locals.flags = flags

    next()
  }

  bind (app) {
    app.use(this.url, this.router)
    app.use(Flags.middleware)
  }
}
