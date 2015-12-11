var Promise = require('pinkie-promise')

module.exports = function readily (fn) {
  function run (callback) {
    var queue = [callback]

    state = function (callback) {
      queue.push(callback)
    }

    fn(function (err) {
      var args = arguments
      function apply (callback) {
        if (callback) callback.apply(null, args)
      }
      state = err ? run : apply
      while (queue.length) apply(queue.shift())
    })
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
