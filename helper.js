'use strict'

let helper = {}

/**
 * Determine whether the value is of type object or not
 *
 * @param {*} value - a value of any type
 * @returns {boolean} - true if value is an object, false otherwise
 */
helper.isTypeOfObject = (value) => typeof value === 'object'

/**
 * Determine whether the value is of type primitives (i.e. not an object) or not
 *
 * @param {*} value - a value of any type
 * @returns {boolean} - true if value is not an object, false otherwise
 */
helper.isTypeOfPrimitive = (value) => typeof value !== 'object'


/**
 * Helper methods
 *
 * @module helper
 */
module.exports = helper
