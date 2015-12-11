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
    state(callback)
  }
}
