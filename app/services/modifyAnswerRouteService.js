const {isUndefined, unset} = require('lodash')

const methods = {}
module.exports = methods

methods.getRedirectUrl = (start, from, to) => `/modify?s=${start}&f=${from}&t=${to}`

methods.setRedirect = (session, from, to) => {
  session.redirectFrom = from
  session.redirectTo = to
}

methods.isRedirectFrom = (session, location) => {
  return (!isUndefined(session.redirectFrom) && session.redirectFrom === location)
}

methods.isRedirectDestination = (session, location) => {
  return (!isUndefined(session.redirectTo) && session.redirectTo === location)
}

methods.activateRedirect = (session) => {
  session.redirectActive = true
}

methods.redirectActive = (session) => {
  return !isUndefined(session.redirectActive)
}

methods.resetRedirect = (session) => {
  unset(session, 'redirectFrom')
  unset(session, 'redirectTo')
  unset(session, 'redirectActive')
}

methods.getRedirectDestination = (session) => session.redirectTo
