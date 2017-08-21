'use strict'

const { mergeWith } = require('lodash')
const { mergeCustomizer } = require('./lib')

module.exports = (target, source, identifier) =>
  mergeWith(target, source, mergeCustomizer(identifier))