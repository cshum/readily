var test = require('tape')
var readily = require('./')

test('Cached result', function (t) {
  t.plan(1 + 5 * 2)
  var fn = readily(function (cb) {
    t.pass('readily called once')
    setTimeout(function () {
      cb(null, 'foo')
    }, 10)
  })

  for (var i = 0; i < 5; i++) {
    fn(function (err, res) {
      t.notOk(err, 'no error')
      t.equal(res, 'foo', 'correct result')
    })
  }
})

test('Error uncached', function (t) {
  t.plan(5 + 2)
  var fn = readily(function (cb) {
    t.pass('readily called')
    setTimeout(function () {
      cb('err')
    }, 10)
  })

  for (var i = 0; i < 5; i++) {
    setTimeout(function () {
      fn(function (err, res) {
        t.equal(err, 'err', 'callback error')
      })
    }, 4 * i)
  }
})

test('Cached result promise', function (t) {
  t.plan(1 + 5)
  var fn = readily(function () {
    t.pass('readily called once')
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve('foo')
      }, 10)
    })
  })

  for (var i = 0; i < 5; i++) {
    fn().then(function (res) {
      t.equal(res, 'foo', 'correct result')
    }).catch(t.error)
  }
})

test('Error uncached promise', function (t) {
  t.plan(5 + 2)
  var fn = readily(function (cb) {
    t.pass('readily called')
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error('err'))
      }, 10)
    })
  })

  for (var i = 0; i < 5; i++) {
    setTimeout(function () {
      fn().catch(function (err) {
        t.equal(err.message, 'err', 'callback error')
      })
    }, 4 * i)
  }
})
