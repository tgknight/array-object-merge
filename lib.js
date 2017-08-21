'use strict'

const { groupBy } = require('lodash')

let lib = {}

lib.groupByCriteria = (obj, identifier) => obj[identifier]

lib.mergeArray = (arr1, arr2, identifier) => {
  let grouped = groupBy([].concat(arr2, arr1), obj => lib.groupByCriteria(obj, identifier))
  return Object.keys(grouped).map(key => Object.assign.apply({}, grouped[key]))
}

lib.mergeCustomizer = identifier => (
  (target, source) => Array.isArray(target) && Array.isArray(source) ?
    lib.mergeArray(source, target, identifier) :
    undefined
)

module.exports = lib