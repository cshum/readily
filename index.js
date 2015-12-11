var Promise = require('pinkie-promise')

function isThenable (val) {
  return val && typeof val.then === 'function'
}

module.exports = function readily (fn) {
  function run (callback) {
    var queue = [callback]

    state = function (callback) {
      queue.push(callback)
    }

    function cb (err) {
      var args = arguments
      function apply (callback) {
        if (callback) callback.apply(null, args)
      }
      state = err ? run : apply
      while (queue.length) apply(queue.shift())
    }

    var val = fn(cb)
    // handle promise if thenable
    if (isThenable(val)) {
      val.then(function (res) {
        cb(null, res)
      }).catch(function (err) {
        cb(err)
      })
    }
  }

  var state = run

  return function (callback) {
    if (typeof callback === 'function') {
      state(callback)
    } else {
      // wrap promise if no callback
      return new Promise(function (resolve, reject) {
        state(function (err, result) {
          if (err) return reject(err)
          resolve(result)
        })
      })
    }
  }
}
