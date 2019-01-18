const {curry, chain, trim, last, parseInt, join, get} = require('lodash')
const {isApplicant, executorApplyingForProbate, onlyApplyingCoExecutors, executorsNotApplying, formatAddress, getExecutorAddress, getGrossIHT, getNetIHT} = require('./services/dataService')
const {getRedirectUrl} = require('./services/modifyAnswerRouteService')

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  filters.listInSentence = (items) => chain(items)
    .map(value => trim(value))
    .slice(0, items.length - 1)
    .join(', ')
    .concat(items.length > 1 ? ' and ' : '', last(items))
    .join('')
    .value()

  filters.pickList = (data, prefix) => chain(data)
    .pickBy((item, key) => key.startsWith(prefix))
    .mapKeys((value, key) => parseInt(key.replace(prefix, '')))
    .toArray()
    .value()

  filters.joinTo = (data1, data2) => chain(data1)
    .zip(data2)
    .map(item => join(item, ' '))
    .value()

  filters.currency = (() => {
    const formatter = new Intl.NumberFormat('gb', {
      style: 'currency',
      currency: 'GBP'
    })
    return formatter.format
  })()

  filters.currencyWhole = (() => {
    const formatter = new Intl.NumberFormat('gb', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0
    })
    return formatter.format
  })()

  filters.address = formatAddress

  filters.isApplicant = isApplicant

  filters.getExecutorAddress = getExecutorAddress

  filters.executorApplyingForProbate = executorApplyingForProbate

  filters.executorsNotApplying = executorsNotApplying

  filters.onlyApplyingCoExecutors = onlyApplyingCoExecutors

  filters.getGrossIHT = getGrossIHT

  filters.getNetIHT = getNetIHT

  const month = curry(get)(['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])(curry.placeholder, undefined)

  filters.month = (m) => month(parseInt(m))

  filters.checkedIf = (value, match) => {
    return (value === match) ? `checked='checked'` : ''
  }

  filters.hiddenIfNot = (value, match) => {
    return (value === match) ? '' : ' js-hidden'
  }

  filters.redirectUrl = getRedirectUrl

  return filters
}
