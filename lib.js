'use strict'

const { groupBy } = require('lodash')

let lib = {}

lib.groupByCriteria = (obj, identifiers) => {
  let identifier = identifiers.filter(id =>
    Object.keys(obj).includes(id)
  )  
  return obj[identifier]
}

lib.mergeArray = (arr1, arr2, identifiers) => {
  let grouped = groupBy(
    [].concat(arr2, arr1),
    obj => lib.groupByCriteria(obj, identifiers)
  )
  return Object.keys(grouped).map(
    key => Object.assign.apply(null, grouped[key])
  )
}

lib.mergeCustomizer = identifiers => (
  (target, source) => Array.isArray(target) && Array.isArray(source) ?
    lib.mergeArray(source, target, identifiers) :
    undefined
)

module.exports = lib