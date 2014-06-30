'use strict';

var grunt = require('grunt');

exports.versionify = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  smartReplaceTheFile: function(test) {
    // Test md5 with replace destination
    test.expect(2);

    var testFile = grunt.file.exists('test/fixtures/123.5ba48b');
    
    test.equal(testFile, true, 'should create stamp with MD5 - replace with Smart');

    var actual = grunt.file.read('test/expected/destinationSmartFile');
    var expected = grunt.file.read('test/expected/default');
    test.equal(actual, expected, 'should replace the filename in destinationSmartFile');

    test.done();
  },

  tearDown: function(done) {
    grunt.file.write('test/expected/destinationSmartFile','test/fixtures/123.{MD5}');
    done();
  }
};
