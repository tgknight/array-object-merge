'use strict'

let original = {
  roles: [{
    key: 'a', value: 'ori'
  }, {
    key: 'b', value: 'ori'
  }],
  props: [{
    type: 'a', content: 'ori'
  }, {
    type: 'b', content: 'ori'
  }],
  dict: { key: 'ori' },
  primitives: [ 'old1', 'old2', 1, 2 ]
}

let update = {
  field: 'newkey',
  roles: [{
    key: 'b', value: 'up'
  }, {
    key: 'c', value: 'ori'
  }],
  props: [{
    type: 'b', content: 'up'
  }, {
    type: 'c', content: 'ori'
  },
  'test'],
  dict: { key: 'up' },
  primitives: [ 'new3', 'new4', 3, 4 ]
}

const merge = require('./index')

/**
 * result = {
 *   field: 'newkey',
 *   roles: [{
 *     key: 'a', value: 'ori'
 *   }, {
 *     key: 'b', value: 'up'
 *   }, {
 *     key: 'c', value: 'ori'
 *   }],
 *   props: [{
 *     type: 'a', content: 'ori'
 *   }, {
 *     type: 'b', content: 'up'
 *   }, {
 *     type: 'c', content: 'ori'
 *   },
 *   'test'],
 *   dict: { key: 'up' },
 *   primitives: [ 'new3', 'new4', 3, 4 ]
 * }
 */
let result = merge(original, update, [ 'key', 'type' ])


/**
 * Merge two objects with one identifier
 */
let original = {
  arr: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }]
}
let update = {
  arr: [{ id: 2, key: 'newValue' }, { id: 3, key: 'value' }],
  field: 'newkey'
}

/**
 * output = {
 *   arr: [
 *     { id: 1, key: 'value' },
 *     { id: 2, key: 'newValue' },
 *     { id: 3, key: 'value' }
 *   ],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, 'id')


/**
 * Merge two objects with multiple arrays and identifiers
 */
let original = {
  arr1: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }],
  arr2: [{ _id: 1, key: 'value' }, { _id: 2, key: 'value' }]
}
let update = {
  arr1: [{ id: 2, key: 'newValue' }],
  arr2: [{ _id: 1, key: 'newValue' }],
  field: 'newkey'
}

/**
 * output = {
 *   arr1: [{ id: 1, key: 'value' }, { id: 2, key: 'newValue' }],
 *   arr2: [{ _id: 1, key: 'newValue' }, { _id: 2, key: 'value' }],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, [ 'id', '_id' ])


/**
 * Merge two objects with arrays of primitive values
 */
let original = {
  arr: [1, 2, 3, 4]
}
let update = {
  arr: [5, 6, 7, 8]
}

/**
 * Per REST specification: the update array will replace the original one
 * output = {
 *   arr: [5, 6, 7, 8]
 * }
 */
let output = merge(original, update)


/**
 * Merge two objects with one identifier and primitive values
 */
let original = {
  arr: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }, 'shouldbegone']
}
let update = {
  arr: [{ id: 2, key: 'newValue' }, { id: 3, key: 'value' }, 'shouldbeincluded'],
  field: 'newkey'
}

/**
 * output = {
 *   arr: [
 *     { id: 1, key: 'value' },
 *     { id: 2, key: 'newValue' },
 *     { id: 3, key: 'value' },
 *     'shouldbeincluded'
 *   ],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, 'id')
