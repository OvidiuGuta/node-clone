var ActionQueue = require('../../src/utils/ActionQueue'),
  Helpers = require('../../src/utils/Helpers');

exports['test_ActionQueue'] = function (test) {
  var count = 0;
  var startTime = (new Date()).getTime();
  test.expect(2);

  Helpers.logInfo(module.filename.toString() + ' started...');

  ActionQueue.enqueue(
    [
      function (callback) {
        callback(null, '1');
      },

      function (data, callback) {
        setTimeout(callback(null, data + ',2'), 5000);
      },

      function (data, callback) {
        setTimeout(callback(null, data + ',3'), 1000);
      },

      function (data, callback) {
        callback(null, data + ',4');
      }
    ],

    function (err, results) {
      test.equal(results, '1,2,3,4');
      Helpers.logInfo('Unit test ended OK.');
    }
  );

  ActionQueue.while(
    function () {
      return count < 5;
    },

    function (callback) {
      count++;
      setTimeout(callback, 1000);
    },

    function (err) {
      if (err) {
        throw err.toString();
      } else {
        var endTime = (new Date()).getTime();
        // 5 seconds have passed?
        test.equal(endTime - startTime >= 5 * 1000, true);
        Helpers.logInfo('Unit test ended OK.');
        test.done();
      }
    }
  );
};
