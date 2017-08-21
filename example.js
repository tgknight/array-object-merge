'use strict'

let original = {
  roles: [{
    key: 'a', value: 'ori'
  }, {
    key: 'b', value: 'ori'
  }]
}

let update = {
  field: 'newkey',
  roles: [{
    key: 'b', value: 'update'
  }, {
    key: 'c', value: 'ori'
  }]
}

const merge = require('./index')

/**
 * result = {
 *   field: 'newkey',
 *   roles: [{
 *     key: 'a', value: 'ori'
 *   }, {
 *     key: 'b', value: 'update'
 *   }, {
 *     key: 'c', value: 'ori
 *   }]
 * }
 */
let result = merge(original, update, 'key')