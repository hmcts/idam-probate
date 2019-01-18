const {chain, concat, split, range, get, reduce, trim, upperFirst, toUpper} = require('lodash')

const methods = {}
module.exports = methods

methods.isApplicant = (data, i) => {
  return (data['applicantFullName'] === data[`executorName${i}`])
}

methods.executorApplyingForProbate = (data, i) => {
  return (get(data, `manageEstate${i}`, false) === true || methods.isApplicant(data, i))
}

methods.onlyApplyingCoExecutors = (data) => {
  return chain(range(0, data['numberOfExecutors']))
    // .map(i => i + 1)
    .filter(i => (!methods.isApplicant(data, i)) && methods.executorApplyingForProbate(data, i))
    .value()
}

methods.executorsNotApplying = (data) => {
  return chain(range(0, data['numberOfExecutors']))
    // .map(i => i + 1)
    .reject(i => methods.executorApplyingForProbate(data, i))
    .value()
}

methods.getExecutorAddress = (data, i) => {
  if (methods.isApplicant(data, i)) {
    return methods.formatAddress(data['applicant'].home)
  } else {
    return methods.formatAddress(data[`executorAddress${i}`])
  }
}

methods.getGrossIHT = (data) => {
  return (data['grossValue'] || data['gross205'] || data['gross207'] || data['gross400'])
}

methods.getNetIHT = (data) => {
  return (data['netValue'] || data['net205'] || data['net207'] || data['net400'])
}

methods.formatAddress = address => (reduce(concat(
  split(get(address, 'street1', ''), '\n'), [
    get(address, 'street2', ''),
    get(address, 'street3', ''),
    get(address, 'town', ''),
    get(address, 'county', '')
  ]), (result, line) => {
  const trimmed = trim(line).replace('\r', '')
  return result + (trimmed.length > 0 ? ((result.length > 0 ? ', ' : '') + chain(trimmed)
    .toLower()
    .split(' ')
    .map(word => (/\d/.test(word) ? toUpper(word) : upperFirst(word)))
    .join(' ')
    .value()) : '')
}, '') + ((get(address, 'postcode', '').length > 0) ? ', ' + toUpper(get(address, 'postcode', '')) : ''))
