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
