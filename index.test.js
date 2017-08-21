'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('array-object-merge', () => {
  let lodash, lib, array_object_merge
  let original, update, identifier

  beforeEach(() => {
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
    identifier = 'key'

    lodash = {
      mergeWith: sinon.spy()
    }
    lib = {
      mergeCustomizer: sinon.spy()
    }
    array_object_merge = proxyquire('./index', {
      'lodash': lodash,
      './lib': lib
    })
  })

  it('should export a function accepting three arguments', () => {
    assert.equal(typeof array_object_merge, 'function')
    assert.equal(array_object_merge.length, 3)
  })

  it('should call mergeWith()', () => {
    array_object_merge(original, update, identifier)

    assert(lodash.mergeWith.firstCall.calledWith(original, update))
    assert(typeof lodash.mergeWith.firstCall.args[2], 'function')
  })

  it('should call mergeCustomizer()', () => {
    array_object_merge(original, update, identifier)

    assert(lib.mergeCustomizer.firstCall.calledWith(identifier))
  })
})