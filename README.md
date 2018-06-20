# array-object-merge [![CircleCI](https://circleci.com/gh/tnptop/array-object-merge.svg?style=svg)](https://circleci.com/gh/tnptop/array-object-merge) [![Coverage Status](https://coveralls.io/repos/github/tnptop/array-object-merge/badge.svg?branch=master)](https://coveralls.io/github/tnptop/array-object-merge?branch=master)

> Merge two objects with arrays of objects based on given object key(s)

Merge two objects with arrays of objects based on given object key(s) (idenfitier).
Logic from [object-array-merge](https://www.npmjs.com/package/object-array-merge) is modified to support extra functionalities, then wrapped with `lodash.mergeWith` as customizer.

Supports multiple arrays with one or more identical object keys.
Note that one object key can be used as an identifier for multiple arrays, but each array can only have one unique object key that will be used as its identifier.

Polyfill for `Object.assign` - `object-assign` was removed, and the code is written in ES6 syntax.

## Examples

```js
/**
 * Merge two objects with one identifier
 */
let original = {
  arr: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }]
}
let update = {
  arr: [{ id: 2, key: 'newValue' }, { id: 3, key: 'value' }],
  field: 'newkey'
}

const merge = require('array-object-merge')
merge(original, update, 'id')
/* output = {
  arr: [
    { id: 1, key: 'value' },
    { id: 2, key: 'newValue' },
    { id: 3, key: 'value' }
  ],
  field: 'newkey'
} */
```

```js
/**
 * Merge two objects with multiple arrays and identifiers 
 */
let original = {
  arr1: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }],
  arr2: [{ _id: 1, key: 'value' }, { _id: 2, key: 'value' }]
}
let update = {
  arr1: [{ id: 2, key: 'newValue' }],
  arr2: [{ _id: 1, key: 'newValue' }],
  field: 'newkey'
}

const merge = require('array-object-merge')
merge(original, update, [ 'id', '_id' ])
/* output = {
  arr1: [{ id: 1, key: 'value' }, { id: 2, key: 'newValue' }],
  arr2: [{ _id: 1, key: 'newValue' }, { _id: 2, key: 'value' }],
  field: 'newkey'
} */
```

## Credits

* [@tomgco](https://www.npmjs.com/~tomgco), the author of [object-array-merge](https://www.npmjs.com/package/object-array-merge), for basis of this pacakge.

## License
This library is under an [MIT License](https://github.com/tnptop/array-object-merge/blob/master/LICENSE).
