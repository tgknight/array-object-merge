'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('lib', () => {
  let groupBySpy, lodash, lib, original, update, result, grouped

  beforeEach(() => {
    original = {
      roles: [{
        key: 'a', value: 'ori'
      }, {
        key: 'b', value: 'ori'
      }]
    }
    update = {
      field: 'newkey',
      roles: [{
        key: 'b', value: 'up'
      }, {
        key: 'c', value: 'ori'
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
      }]
    }
    grouped = {
      a: [ { key: 'a', value: 'ori' } ],
      b: [ { key: 'b', value: 'ori' }, { key: 'b', value: 'up' } ],
      c: [ { key: 'c', value: 'ori' } ]
    }

    lodash = { groupBy: sinon.stub().returns(grouped) }
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
      let obj = { key: 'a' }
      let identifier = 'key'

      assert.equal(lib.groupByCriteria(obj, identifier), obj[identifier])
    })
  })

  describe('mergeArray()', () => {
    let concatenatedArray, identifier, groupByCriteriaSpy, assignSpy

    beforeEach(() => {
      identifier = 'key'
      concatenatedArray = [].concat(update.roles, original.roles)
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
      assert.deepEqual(lib.mergeArray(original.roles, update.roles, identifier), result.roles)
    })

    it('should call lodash.groupBy()', () => {
      lib.mergeArray(original.roles, update.roles, identifier)

      assert(lodash.groupBy.firstCall.calledWith(concatenatedArray))
    })

    it('should call groupByCriteria()', () => {
      lib.mergeArray(original.roles, update.roles, identifier)
      lodash.groupBy.yield(original.roles[0])
      
      assert(groupByCriteriaSpy.calledWith(original.roles[0], identifier))
    })
    
    it('should call Object.assign()', () => {
      lib.mergeArray(original.roles, update.roles, identifier)

      Object.keys(grouped).map(key => {

        assert(assignSpy.calledWith())
      })
    })
  })

  describe('mergeCustomizer()', () => {
    let identifier

    beforeEach(() => {
      identifier = 'key'
    })

    it('should accept one argument', () => {
      assert.equal(typeof lib.mergeCustomizer, 'function')
      assert.equal(lib.mergeCustomizer.length, 1)
    })

    it('should return a lodash.mergeWith() customizer accepting two arguments', () => {
      let customizer = lib.mergeCustomizer(identifier)

      assert.equal(typeof customizer, 'function')
      assert.equal(customizer.length, 2)
    })

    describe('customizer()', () => {
      let customizer, source, target, mergeArraySpy

      beforeEach(() => {
        customizer = lib.mergeCustomizer(identifier)
        mergeArraySpy = sinon.spy(lib, 'mergeArray')
      })

      afterEach(() => {
        lib.mergeArray.restore()
      })

      it('should call mergeArray() when both of the arguments are arrays', () => {
        customizer([ 'target' ], [ 'source' ])

        assert(lib.mergeArray.firstCall.calledWithExactly([ 'source' ], [ 'target' ], identifier))
      })

      it('should return a result from mergeArray() when both of the arguments are arrays', () => {
        assert.deepEqual(customizer(original.roles, update.roles), result.roles)
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