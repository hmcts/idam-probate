const expressValidator = require('express-validator')
const moment = require('moment')

const simplePhoneNum = /(\+\d\d){0,1} {0,1}(\(0\)){0,1} {0,1}([\d] {0,1}){9,12}/

module.exports = expressValidator({
  customValidators: {
    isValidDate: function (val, date) {
      return moment(date, [
        'DD/MM/YYYY',
        'D/MM/YYYY',
        'DD/M/YYYY',
        'D/M/YYYY'], true
      ).isValid()
    },
    isPhoneNumber: (val) => {
      return simplePhoneNum.test(val)
    },
    notEmptyHwfReference: (val, reference) => {
      return (reference === 'Yes') ? val.length > 0 : true
    }
  }
})
