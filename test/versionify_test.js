'use strict';

var grunt = require('grunt');

exports.versionify = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  default: function(test) {
    // Test default (md5 only)
    test.expect(2);

    var testFile1 = grunt.file.exists('test/fixtures/123.5ba48b');
    var testFile2 = grunt.file.exists('test/fixtures/testing.fa6a5a');

    test.equal(testFile1, true, 'should create stamp with md5');
    test.equal(testFile2, true, 'should create stamp with md5');

    test.done();
  },

  gitOnly: function(test) {
    // Test git only
    test.expect(2);

    var testFile1 = grunt.file.exists('test/fixtures/123.703ca8');
    var testFile2 = grunt.file.exists('test/fixtures/testing.0a9012');
    
    test.equal(testFile1, true, 'should create stamp with git');
    test.equal(testFile2, true, 'should create stamp with git');

    test.done();
  },

  md5WithGit: function(test) {
    // Test md5 with GIT stamp
    test.expect(2);

    var testFile1 = grunt.file.exists('test/fixtures/123.703ca8.5ba48b');
    var testFile2 = grunt.file.exists('test/fixtures/testing.0a9012.fa6a5a');
    
    test.equal(testFile1, true, 'should create stamp with git and MD5');
    test.equal(testFile2, true, 'should create stamp with git and MD5');

    test.done();
  }
};
