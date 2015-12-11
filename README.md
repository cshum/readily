# readily

[![Build Status](https://travis-ci.org/cshum/readily.svg)](https://travis-ci.org/cshum/readily)

```
npm install readily
```

Buffer evaluation of a paramless async function, result is cached if resolved. 
Supports both promise and callback.

Using promise:

```js
var readily = require('readily')

var dbReady = readily(function () {
  // will only be called once if no error
  return db.open() // returns promise
})

// call dbReady multiple times
for (var i = 0; i < 10; i++) {
  dbReady().then(function (res) {
    // returns cached result for subsequent calls
    return db.query(...)
  }).catch(function (err) {
    console.error(err)
  })
}

```
Using callback:

```js
var readily = require('readily')

var dbReady = readily(function (callback) {
  // will only be called once if no error
  db.open(callback)
})

// call dbReady multiple times
for (var i = 0; i < 10; i++) {
  dbReady(function (err, res) {
    if (err) return console.error(err)
    // returns cached result for subsequent calls
    db.query(...)
  })
}

```

## License

MIT
