'use strict'

const mergeWith = require('lodash.mergewith')
const { mergeCustomizer } = require('./lib')

module.exports = (target, source, identifiers) =>
  mergeWith(target, source, mergeCustomizer(identifiers))
