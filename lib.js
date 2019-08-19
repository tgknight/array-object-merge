'use strict'

const groupBy = require('lodash.groupby')
const helper = require('./helper')

let lib = {}

/**
 * Generate a key for lodash.groupBy
 *
 * @param {Object.<string,*>} obj - an object passed from lodash.groupBy
 * @param {string|string[]} identifiers - a key of an array of keys of objects to be merged
 * @returns {*} - the value associated to provided identifiers
 */
lib.groupByCriteria = (obj, identifiers) => {
  const identifier = Array.isArray(identifiers) ?
    identifiers.filter((id) => Object.keys(obj).includes(id)) :
    identifiers
  return obj[identifier]
}

/**
 * Merge two object arrays together using lodash.groupBy
 *
 * @param {*[]} target - the original array, only with elements of type object
 * @param {*[]} source - the update array, only with elements of type object
 * @param {string|string[]} identifiers - a key or an array of keys of objects to be merged
 * @returns {*[]} - the merged array
 */
// TODO: make sure that the order is preserved when merging
lib.mergeArrayObject = (target, source, identifiers) => {
  const grouped = groupBy(
    [].concat(target, source),
    (obj) => lib.groupByCriteria(obj, identifiers)
  )
  delete grouped['undefined']
  // the array is now sorted alphanumerically by keys of grouped
  // TODO: fix the above behavior
  return Object.values(grouped).map(
    (value) => Object.assign.apply(null, value)
  )
}

/**
 * Merge the two arrays together with given identifiers
 *
 * @param {*[]} target - the original array
 * @param {*[]} source - the update array
 * @param {string|string[]} identifiers - a key or an array of keys of objects to be merged
 * @returns {*[]} - the merged array
 */
lib.mergeArray = (target, source, identifiers) => {
  // all primitive elements in the update array (source)
  // replaces those of the original array (target)
  // per REST specification on updating object
  const sourceArrObject = source.filter(helper.isTypeOfObject)
  const sourceArrPrimitive = source.filter(helper.isTypeOfPrimitive)

  // with the reason stated above, we can safely ignore
  // elements that is not of type 'object' from the original array (target)
  const targetArrObject = target.filter(helper.isTypeOfObject)

  // the order of the elements is not guaranteed
  // TODO: make sure that the order is preserved
  return [].concat(
    lib.mergeArrayObject(targetArrObject, sourceArrObject, identifiers),
    sourceArrPrimitive
  )
}

/**
 * Create a customizer for lodash.mergeWith from given identifiers
 *
 * @param {string|string[]} identifiers - a key or an array of keys of objects to be merged
 * @returns {function(*=, *=): *[]|undefined} - a customizer function, refer to lodash.mergeWith documentation for more details
 */
lib.mergeCustomizer = identifiers => (
  (target, source) => Array.isArray(target) && Array.isArray(source) ?
    lib.mergeArray(target, source, identifiers) :
    undefined
)

/**
 * Logic for merging array of objects
 *
 * @module lib
 */
module.exports = lib
