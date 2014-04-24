/*
 * grunt-versionify
 * https://github.com/eeertekin/grunt-versionify
 *
 * Copyright (c) 2014 Ertugrul Emre Ertekin
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/fixtures/123.*','test/fixtures/testing.*'],
    },

    // Configuration to be run (and then tested).
    versionify: {
      default: {
        options: {},
        files: {
          'test/expected/destinationFile': ['test/fixtures/testing', 'test/fixtures/123']
        },
      },
      gitOnly: {
        options: {
          md5 : false,
          git : true
        },
        files: {
          'test/expected/destinationFile': ['test/fixtures/testing', 'test/fixtures/123']
        },
      },
      md5WithGit: {
        options: {
          md5 : true,
          git : true
        },
        files: {
          'test/expected/destinationFile': ['test/fixtures/testing', 'test/fixtures/123']
        },
      },
      replaceTheFile: {
        options: {
          replaceDest: true
        },
        files: {
          'test/expected/destinationFile': ['test/fixtures/testing', 'test/fixtures/123']
        },
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'versionify', 'nodeunit','clean']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
