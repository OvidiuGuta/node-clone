var CUBRIDClient = require('./test_Setup').createDefaultCUBRIDDemodbConnection,
  ActionQueue = require('../src/utils/ActionQueue'),
  Helpers = require('../src/utils/Helpers'),
  Result2Array = require('../src/resultset/Result2Array'),
  assert = require('assert');

Helpers.logInfo(module.filename.toString() + ' started...');

ActionQueue.enqueue(
  [
    function (callback) {
      CUBRIDClient.connect(callback);
    },

    function (callback) {
      CUBRIDClient.getSchema(CUBRIDClient.SCHEMA_CLASS_PRIVILEGE, null, callback);
    },

    function (result, callback) {
      for (var i = 0; i < result.length; i++) {
        Helpers.logInfo(result[i]);
      }

      if (CUBRIDClient._DB_ENGINE_VER.startsWith('8.4')) {
        assert(result.length === 96);
      }
      else {
        if (CUBRIDClient._DB_ENGINE_VER.startsWith('9.1')) {
          assert(result.length === 97);
        }
      }
      assert(result[0].TableName === 'db_root');
      assert(result[0].Privilege === 'SELECT');
      assert(result[0].Grantable === false);
      CUBRIDClient.close(callback);
    }
  ],

  function (err) {
    if (err) {
      throw err.message;
    } else {
      Helpers.logInfo('Test passed.');
    }
  }
);
