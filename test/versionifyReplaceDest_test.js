'use strict';

var grunt = require('grunt');

exports.versionify = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  replaceTheFile: function(test) {
    // Test md5 with replace destination
    test.expect(2);

    var testFile = grunt.file.exists('test/fixtures/123.5ba48b');
    
    test.equal(testFile, true, 'should create stamp with git and MD5');

    var actual = grunt.file.read('test/expected/destinationFile');
    var expected = grunt.file.read('test/expected/default');
    test.equal(actual, expected, 'should replace the filename in destinationFile');

    test.done();
  },

  tearDown: function(done) {
    grunt.file.write('test/expected/destinationFile','test/fixtures/123');
    done();
  }
};
