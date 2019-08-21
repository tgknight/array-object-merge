'use strict'

const assert = require('chai').assert
const sinon = require('sinon')

describe('helper', () => {
  let helper

  beforeEach(() => {
    helper = require('../helper')
  })

  describe('isTypeOfObject()', () => {
    it('should accept one argument', () => {
      assert.equal(typeof helper.isTypeOfObject, 'function')
      assert.equal(helper.isTypeOfObject.length, 1)
    })

    it('should return true if the argument is an object', () => {
      let objects = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]

      objects.forEach((object) => {
        assert.equal(helper.isTypeOfObject(object), true)
      })
    })

    it('should return false if the argument is not an object', () => {
      let primitives = ['string', true, 10, 20.25, Symbol('foo')]

      primitives.forEach((primitive) => {
        assert.equal(helper.isTypeOfObject(primitive), false)
      })
    })
  })

  describe('isTypeOfPrimitive()', () => {
    it('should accept one argument', () => {
      assert.equal(typeof helper.isTypeOfPrimitive, 'function')
      assert.equal(helper.isTypeOfPrimitive.length, 1)
    })

    it('should return true if the argument is a primitive value (i.e. not an object)', () => {
      let primitives = ['string', true, 10, 20.25, Symbol('foo')]

      primitives.forEach((primitive) => {
        assert.equal(helper.isTypeOfPrimitive(primitive), true)
      })
    })

    it('should return false if the argument is not a primitive value (i.e. an object)', () => {
      let objects = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]

      objects.forEach((object) => {
        assert.equal(helper.isTypeOfPrimitive(object), false)
      })
    })
  })
})
