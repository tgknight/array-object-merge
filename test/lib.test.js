'use strict'

const assert = require('chai').assert
const proxyquire = require('proxyquire').noCallThru()
const sinon = require('sinon')

describe('lib', () => {
  let groupByStub, lib, original, update, result, grouped
  let helper, isTypeOfObjectSpy, isTypeOfPrimitiveSpy

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
      primitives: ['old1', 'old2', 1, 2]
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
      }],
      dict: { key: 'up' },
      primitives: ['new3', 'new4', 3, 4]
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
      }],
      dict: { key: 'up' },
      primitives: ['new3', 'new4', 3, 4]
    }

    grouped = {
      roles: {
        a: [{ key: 'a', value: 'ori' }],
        b: [{ key: 'b', value: 'ori' }, { key: 'b', value: 'up' }],
        c: [{ key: 'c', value: 'ori' }]
      },
      props: {
        a: [{ type: 'a', content: 'ori' }],
        b: [{ type: 'b', content: 'ori' }, { type: 'b', content: 'up' }],
        c: [{ type: 'c', content: 'ori' }]
      }
    }
    groupByStub = sinon.stub()
    groupByStub.onCall(0).returns(grouped.roles)
    groupByStub.onCall(1).returns(grouped.props)

    helper = require('../helper')
    isTypeOfObjectSpy = sinon.spy(helper, 'isTypeOfObject')
    isTypeOfPrimitiveSpy = sinon.spy(helper, 'isTypeOfPrimitive')

    lib = proxyquire('../lib', {
      'lodash.groupby': groupByStub,
      './helper': helper
    })
  })

  afterEach(() => {
    helper.isTypeOfObject.restore()
    helper.isTypeOfPrimitive.restore()
  })

  describe('groupByCriteria()', () => {
    it('should accept two arguments', () => {
      assert.equal(typeof lib.groupByCriteria, 'function')
      assert.equal(lib.groupByCriteria.length, 2)
    })

    it('should accept both string and array for the second argument', () => {
      let obj = { key: 'a' }
      let identifiers = ['key', 'type']

      assert.isOk(lib.groupByCriteria(obj, 'key'))
      assert.isOk(lib.groupByCriteria(obj, identifiers))
    })

    it('should return a property of an object specified in the arguments', () => {
      let obj1 = { key: 'a' }
      let obj2 = { type: 'a' }
      let identifiers = ['key', 'type']

      assert.equal(lib.groupByCriteria(obj1, 'key'), obj1.key)
      assert.equal(lib.groupByCriteria(obj1, identifiers), obj1.key)
      assert.equal(lib.groupByCriteria(obj2, identifiers), obj2.type)
    })
  })

  describe('mergeArrayObject()', () => {
    let concatenatedArray, identifiers, groupByCriteriaSpy, assignSpy
    const applyGrouped = cb => Object.keys(grouped).map(cb)

    beforeEach(() => {
      identifiers = ['key', 'type']
      concatenatedArray = Object.keys(grouped).reduce((obj, key) =>
        Object.assign(obj, { [key]: [].concat(original[key], update[key]) })
      , {})
      groupByCriteriaSpy = sinon.spy(lib, 'groupByCriteria')
      assignSpy = sinon.spy(Object, 'assign')
    })

    afterEach(() => {
      lib.groupByCriteria.restore()
      Object.assign.restore()
    })

    it('should accept three arguments', () => {
      assert.equal(typeof lib.mergeArrayObject, 'function')
      assert.equal(lib.mergeArrayObject.length, 3)
    })

    it('should return an array with merged objects', () => {
      applyGrouped((key) =>
        assert.deepEqual(
          lib.mergeArrayObject(original[key], update[key], identifiers),
          result[key]
        )
      )
    })

    it('should call groupBy()', () => {
      applyGrouped((key, index) => {
        lib.mergeArrayObject(original[key], update[key], identifiers)

        assert.deepEqual(
          groupByStub.args[index][0],
          concatenatedArray[key]
        )
      })
    })

    it('should call groupByCriteria()', () => {
      applyGrouped((key, index) => {
        lib.mergeArrayObject(original[key], update[key], identifiers)
        groupByStub.yield(original[key][0])

        assert.deepEqual(
          groupByCriteriaSpy.args[index],
          [original[key][0], identifiers]
        )
      })
    })

    it('should call Object.assign()', () => {
      applyGrouped((key) => {
        lib.mergeArrayObject(original[key], update[key], identifiers)
      })

      applyGrouped((key,index) => {
        Object.keys(grouped[key]).map((id, pos) => {
          let callIndex = pos + (index * Object.keys(grouped[key]).length)
          assert.deepEqual(assignSpy.getCall(callIndex).args, grouped[key][id])
        })
      })
    })
  })

  describe('mergeArray()', () => {
    let identifiers, target, source, mergeArrayObjectStub

    beforeEach(() => {
      identifiers = ['key', 'type']
      target = [{ from: 'target'}, 'target']
      source = [{ from: 'source'}, 'source']
      mergeArrayObjectStub = sinon.stub(lib, 'mergeArrayObject')
      mergeArrayObjectStub.returns([{ from: 'source'}])
    })

    afterEach(() => {
      lib.mergeArrayObject.restore()
    })

    it('should accept three arguments', () => {
      assert.equal(typeof lib.mergeArray, 'function')
      assert.equal(lib.mergeArray.length, 3)
    })

    it('should call helper.isTypeOfObject()', () => {
      lib.mergeArray(target, source, identifiers)

      // Array.prototype.filter sends [elem, index, originalArray] to callback
      assert.deepEqual(
        isTypeOfObjectSpy.args.map((args) => args[0]),
        [].concat(source, target)
      )
    })

    it('should call helper.isTypeOfPrimitive()', () => {
      lib.mergeArray(target, source, identifiers)

      assert.deepEqual(
        isTypeOfPrimitiveSpy.args.map((args) => args[0]),
        source
      )
    })

    it('should call lib.mergeArrayObject() ', () => {
      lib.mergeArray(target, source, identifiers)

      assert.deepEqual(
        mergeArrayObjectStub.args[0],
        [[{ from: 'target'}], [{ from: 'source' }], identifiers])
    })

    it('should return an array', () => {
      let mergedArray = lib.mergeArray(target, source, identifiers)

      assert.deepEqual(mergedArray, [{ from: 'source'}, 'source'])
    })
  })

  describe('mergeCustomizer()', () => {
    let identifiers

    beforeEach(() => {
      identifiers = ['key', 'type']
    })

    it('should accept one argument', () => {
      assert.equal(typeof lib.mergeCustomizer, 'function')
      assert.equal(lib.mergeCustomizer.length, 1)
    })

    it('should return a mergeWith() customizer accepting two arguments', () => {
      let customizer = lib.mergeCustomizer(identifiers)

      assert.equal(typeof customizer, 'function')
      assert.equal(customizer.length, 2)
    })

    describe('customizer()', () => {
      let customizer, mergeArraySpy

      beforeEach(() => {
        customizer = lib.mergeCustomizer(identifiers)
        mergeArraySpy = sinon.spy(lib, 'mergeArray')
      })

      afterEach(() => {
        lib.mergeArray.restore()
      })

      it('should call mergeArray() when both of the arguments are arrays', () => {
        customizer(['target'], ['source'])

        assert(lib.mergeArray.firstCall.calledWithExactly(['target'], ['source'], identifiers))
      })

      it('should return a result from mergeArray() when both of the arguments are arrays', () => {
        assert.deepEqual(customizer(original.roles, update.roles), result.roles)
        assert.deepEqual(customizer(original.props, update.props), result.props)
      })

      it('should return undefined when at least one of the arguments is not an array', () => {
        let argumentList = [
          [{}, ['source']],
          [['target'], {}],
          [{}, {}]
        ]

        argumentList.forEach(argument => {
          assert.equal(customizer.apply(null, argument), undefined)
        })
      })
    })
  })
})
