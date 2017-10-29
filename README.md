# array-object-merge [![CircleCI](https://circleci.com/gh/tgknight/array-object-merge.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/tgknight/array-object-merge) [![Coverage Status](https://coveralls.io/repos/github/tgknight/array-object-merge/badge.svg?branch=master)](https://coveralls.io/github/tgknight/array-object-merge?branch=master)

> Merge two objects with arrays of objects based on given object key

Merge two objects with arrays of objects based on given object key (idenfitier).
This package wraps [object-array-merge](https://www.npmjs.com/package/object-array-merge)
with `lodash.mergeWith`, using it as a customizer, and modifies some logic for extra functionalities.

Supports multiple arrays with one or more identical object keys.

```js
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
// support merging of these objects
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

Polyfill for `Object.assign` - `object-assign` was removed, and the code is written in ES6 syntax.

## Credits

* [@tomgco](https://www.npmjs.com/~tomgco), the author of [object-array-merge](https://www.npmjs.com/package/object-array-merge), for basis of this pacakge.
