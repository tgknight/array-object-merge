'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('array-object-merge', () => {
  let lodashMergeWith, lib, array_object_merge
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
      }],
      dict: { key: 'ori' },
      primitives: [ 'old1', 'old2', 1, 2 ]
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
      },
      'test'],
      dict: { key: 'up' },
      primitives: [ 'new3', 'new4', 3, 4 ]
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
      },
      'test'],
      dict: { key: 'up' },
      primitives: [ 'new3', 'new4', 3, 4 ]
    }
    identifiers = [ 'key', 'type' ]

    lodashMergeWith = require('lodash.mergewith')
    mergeWithSpy = sinon.spy(lodashMergeWith)

    lib = require('../lib')
    mergeCustomizerSpy = sinon.spy(lib, 'mergeCustomizer')

    array_object_merge = proxyquire('../index', {
      'lodash.mergewith': mergeWithSpy,
      './lib': lib
    })
  })

  afterEach(() => {
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
    // load with real dependencies
    array_object_merge = require('../index')
    assert.deepEqual(
      array_object_merge(original, update, identifiers),
      result
    )
  })
})
