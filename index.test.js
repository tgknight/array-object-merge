'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('array-object-merge', () => {
  let lodash, lib, array_object_merge
  let mergeWithSpy, mergeCustomizerSpy
  let original, update, result, identifiers

  beforeEach(() => {
    original = {
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
    update = {
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
    result = {
      field: 'newkey',
      roles: [{
        key: 'a', value: 'ori'
      }, {
        key: 'b', value: 'up'
      }, {
        key: 'c', value: 'ori'
      }],
      props: [{
        type: 'a', content: 'ori'
      }, {
        type: 'b', content: 'up'
      }, {
        type: 'c', content: 'ori'
      }]
    }
    identifiers = [ 'key', 'type' ]

    lodash = require('lodash')
    mergeWithSpy = sinon.spy(lodash, 'mergeWith')

    lib = require('./lib')
    mergeCustomizerSpy = sinon.spy(lib, 'mergeCustomizer')

    array_object_merge = proxyquire('./index', {
      'lodash': lodash,
      './lib': lib
    })
  })

  afterEach(() => {
    lodash.mergeWith.restore()
    lib.mergeCustomizer.restore()
  })

  it('should export a function accepting three arguments', () => {
    assert.equal(typeof array_object_merge, 'function')
    assert.equal(array_object_merge.length, 3)
  })

  it('should call mergeWith()', () => {
    array_object_merge(original, update, identifiers)

    assert(mergeWithSpy.firstCall.calledWith(original, update))
    assert(typeof mergeWithSpy.firstCall.args[2], 'function')
  })

  it('should call mergeCustomizer()', () => {
    array_object_merge(original, update, identifiers)

    assert(mergeCustomizerSpy.firstCall.calledWith(identifiers))
  })

  it('should work properly', () => {
    assert.deepEqual(
      array_object_merge(original, update, identifiers),
      result
    )
  })
})