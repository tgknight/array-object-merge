'use strict'

const mergeWith = require('lodash.mergewith')
const cloneDeep = require('lodash.clonedeep')
const { mergeCustomizer } = require('./lib')

/**
 * `array-object-merge`.
 *
 * @module `array-object-merge`
 */

/**
 * Merge two object with array of of objects based on given object key(s)
 *
 * @param {*[]} target - the original array
 * @param {*[]} source - the update array
 * @param {string|string[]} identifiers - a key or an array of keys of objects to be merged
 */
module.exports = (target, source, identifiers) =>
  mergeWith(target, cloneDeep(source), mergeCustomizer(identifiers))
