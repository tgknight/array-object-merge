# array-object-merge [![CircleCI](https://circleci.com/gh/tnptop/array-object-merge.svg?style=svg)](https://circleci.com/gh/tnptop/array-object-merge) [![Coverage Status](https://coveralls.io/repos/github/tnptop/array-object-merge/badge.svg?branch=master)](https://coveralls.io/github/tnptop/array-object-merge?branch=master)

> Merge two objects with arrays of objects based on given object key(s)

Merge two objects with arrays of objects based on given object key(s) (identifier).
Logic from [object-array-merge](https://www.npmjs.com/package/object-array-merge) is modified to support extra functionalities, then wrapped with `lodash.mergeWith` as customizer.

Supports multiple arrays with one or more identical object keys.
Note that one object key can be used as an identifier for multiple arrays, but each array can only have one unique object key that will be used as its identifier. Objects not having the key will be ignored.

The intended use case for this package is to update documents in document-based database (e.g. MongoDB) following the definition of `PATCH` HTTP verb. This package tries to extend `PATCH` definition to array of objects (as in the request body can contains only changes, instead of an entire content (i.e. `PUT` HTTP verb)).

#### Limitations (as of 1.2.0)
- The result array currently is ordered alphanumerically according to the result of `lodash.groupBy`
- Does not support arrays with both object and primitive elements; only primitive elements of the update object remains. (See [Examples](#Examples) section for code sample).  
  Array of objects only or primitive only still work as expected. 

## Usage
### Installation
```bash
# NPM
npm i array-object-merge

# Yarn
yarn add array-object-merge
```

### CommonJS
```js
const merge = require('array-object-merge')

merge(original, update, identifiers)
```

### ES6
```ecmascript 6
import merge from 'array-object-merge'

merge(original, update, identifiers)
```

## Test
Clone this repository to your local environment, then:
```bash
cd /path/to/local/array-object-merge

# NPM
npm install
npm test
npm run coverage # Optional

# Yarn
yarn install
yarn test
yarn run coverage # Optional

```

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

/**
 * output = {
 *   arr: [
 *     { id: 1, key: 'value' },
 *     { id: 2, key: 'newValue' },
 *     { id: 3, key: 'value' }
 *   ],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, 'id')


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

/**
 * output = {
 *   arr1: [{ id: 1, key: 'value' }, { id: 2, key: 'newValue' }],
 *   arr2: [{ _id: 1, key: 'newValue' }, { _id: 2, key: 'value' }],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, [ 'id', '_id' ])


/**
 * Merge two objects with arrays of primitive values
 */
let original = {
  arr: [1, 2, 3, 4]
}
let update = {
  arr: [5, 6, 7, 8]
}

/**
 * Per REST specification: the update array will replace the original one
 * output = {
 *   arr: [5, 6, 7, 8]
 * }
 */
let output = merge(original, update)


/**
 * Merge two objects with one identifier and primitive values
 */
let original = {
  arr: [{ id: 1, key: 'value' }, { id: 2, key: 'value' }, 'shouldbegone']
}
let update = {
  arr: [{ id: 2, key: 'newValue' }, { id: 3, key: 'value' }, 'shouldbeincluded'],
  field: 'newkey'
}

/**
 * output = {
 *   arr: [
 *     { id: 1, key: 'value' },
 *     { id: 2, key: 'newValue' },
 *     { id: 3, key: 'value' },
 *     'shouldbeincluded'
 *   ],
 *   field: 'newkey'
 * }
 */
let output = merge(original, update, 'id')
```

## Credits

* [@tomgco](https://www.npmjs.com/~tomgco), the author of [object-array-merge](https://www.npmjs.com/package/object-array-merge), for basis of this pacakge.

## License
This library is under an [MIT License](https://github.com/tnptop/array-object-merge/blob/master/LICENSE).
