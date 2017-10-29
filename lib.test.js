'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('lib', () => {
  let groupByStub, lodash, lib, original, update, result
  let grouped

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
    grouped = {
      roles: {
        a: [ { key: 'a', value: 'ori' } ],
        b: [ { key: 'b', value: 'ori' }, { key: 'b', value: 'up' } ],
        c: [ { key: 'c', value: 'ori' } ]
      },
      props: {
        a: [ { type: 'a', content: 'ori' } ],
        b: [ { type: 'b', content: 'ori' }, { type: 'b', content: 'up' } ],
        c: [ { type: 'c', content: 'ori' } ]
      }
    }
    groupByStub = sinon.stub()
    groupByStub.onCall(0).returns(grouped.roles)
    groupByStub.onCall(1).returns(grouped.props)

    lodash = { groupBy: groupByStub }
    lib = proxyquire('./lib', {
      'lodash': lodash
    })
  })

  describe('groupByCriteria()', () => {
    it('should accept two arguments', () => {
      assert.equal(typeof lib.groupByCriteria, 'function')
      assert.equal(lib.groupByCriteria.length, 2)
    })

    it('should return a property of an object specified in the arguments', () => {
      let obj1 = { key: 'a' }
      let obj2 = { type: 'a' }
      let identifiers = [ 'key', 'type' ]

      assert.equal(lib.groupByCriteria(obj1, identifiers), obj1['key'])
      assert.equal(lib.groupByCriteria(obj2, identifiers), obj2['type'])
    })
  })

  describe('mergeArray()', () => {
    let concatenatedArray, identifiers, groupByCriteriaSpy, assignSpy
    const applyGrouped = cb => Object.keys(grouped).map(cb)

    beforeEach(() => {
      identifiers = [ 'key', 'type' ]
      concatenatedArray = Object.keys(grouped).reduce((obj, key) =>
        Object.assign(obj, { [key]: [].concat(update[key], original[key]) })
      , {})
      groupByCriteriaSpy = sinon.spy(lib, 'groupByCriteria')
      assignSpy = sinon.spy(Object, 'assign')
    })

    afterEach(() => {
      lib.groupByCriteria.restore()
      Object.assign.restore()
    })

    it('should accept three arguments', () => {
      assert.equal(typeof lib.mergeArray, 'function')
      assert.equal(lib.mergeArray.length, 3)
    })

    it('should return an array with merged objects', () => {
      applyGrouped(key => 
        assert.deepEqual(
          lib.mergeArray(original[key], update[key], identifiers),
          result[key]
        )
      )
    })

    it('should call lodash.groupBy()', () => {
      applyGrouped((key, index) => {
        lib.mergeArray(original[key], update[key], identifiers)

        assert(lodash.groupBy.getCall(index).calledWith(concatenatedArray[key]))
      })
    })

    it('should call groupByCriteria()', () => {
      applyGrouped(key => {
        lib.mergeArray(original[key], update[key], identifiers)
        lodash.groupBy.yield(original[key][0])
        
        assert(groupByCriteriaSpy.calledWith(original[key][0], identifiers))
      })
    })
    
    it('should call Object.assign()', () => {
      applyGrouped(key => {
        lib.mergeArray(original[key], update[key], identifiers)
      })

      applyGrouped((key,index) => {
        Object.keys(grouped[key]).map((id, pos) => {
          let callIndex = pos + (index * Object.keys(grouped[key]).length)
          assert.deepEqual(assignSpy.getCall(callIndex).args, grouped[key][id])
        })
      })
    })
  })

  describe('mergeCustomizer()', () => {
    let identifiers

    beforeEach(() => {
      identifiers = [ 'key', 'type' ]
    })

    it('should accept one argument', () => {
      assert.equal(typeof lib.mergeCustomizer, 'function')
      assert.equal(lib.mergeCustomizer.length, 1)
    })

    it('should return a lodash.mergeWith() customizer accepting two arguments', () => {
      let customizer = lib.mergeCustomizer(identifiers)

      assert.equal(typeof customizer, 'function')
      assert.equal(customizer.length, 2)
    })

    describe('customizer()', () => {
      let customizer, source, target, mergeArraySpy

      beforeEach(() => {
        customizer = lib.mergeCustomizer(identifiers)
        mergeArraySpy = sinon.spy(lib, 'mergeArray')
      })

      afterEach(() => {
        lib.mergeArray.restore()
      })

      it('should call mergeArray() when both of the arguments are arrays', () => {
        customizer([ 'target' ], [ 'source' ])

        assert(lib.mergeArray.firstCall.calledWithExactly([ 'source' ], [ 'target' ], identifiers))
      })

      it('should return a result from mergeArray() when both of the arguments are arrays', () => {
        assert.deepEqual(customizer(original.roles, update.roles), result.roles)
        assert.deepEqual(customizer(original.props, update.props), result.props)
      })

      it('should return undefined when at least one of the arguments is not an array', () => {
        let argumentList = [
          [ {}, [ 'source' ] ],
          [ [ 'target' ], {} ],
          [ {}, {} ]
        ]
        
        argumentList.forEach(argument => {
          assert.equal(customizer.apply(undefined, argument), undefined)
        })
      })
    })
  })
})
