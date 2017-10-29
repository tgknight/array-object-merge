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
  }]
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
  }]
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
 *   }]
}
 */
let result = merge(original, update, [ 'key', 'type' ])