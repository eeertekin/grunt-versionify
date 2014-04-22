/*
 * grunt-versionify
 * https://github.com/eeertekin/grunt-versionify
 *
 * Copyright (c) 2014 Ertugrul Emre Ertekin
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    shell = require('shelljs/global'),
    async = require('async'),
    crypto = require('crypto'),
    fs = require('fs');


module.exports = function(grunt) {

  var getMD5Sum = function(filepath, cb) {
    var md5 = crypto.createHash('md5');

    var s = fs.ReadStream(filepath);
    s.on('data', function(d) {
      md5.update(d);
    });

    s.on('end', function() {
      var md5sum = md5.digest('hex');
      cb(null,{md5sum:md5sum})
    });
  };


  var getGitRevID = function(filepath, cb) {
    if (!which('git')) {
      grunt.fail.warn('This feature requires git');
    }

    var revID = '',
        lsTree = exec('git ls-tree HEAD '+ filepath, {silent:true}).output,
        revData = lsTree.split('\t');
        if ( lsTree.indexOf("Not a git repository") != -1) {
          grunt.fail.warn(lsTree);
        }

    if ( revData[0] ) {
      revData = revData[0].split(' ');
      if (revData[2]) {
        revID = revData[2];
      }
    }

    console.log(filepath + " getting GIT revID");
    cb(null,{gitsum:revID})
  };

  grunt.registerMultiTask('versionify', 'Version stamp for your files with GIT/MD5', function() {
    // Async task
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      git : false,
      md5 : true,
      replaceDest : false
    });

    
    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      if(options.replaceDest) {
        if(!grunt.file.exists(f.dest)){
          grunt.fail.warn("Destination file " + f.dest + " not found");
        }
      }

      // Check if file(s) are exists
      var files = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });
      
      async.map(files, function( file, callback) {

          if (options.md5 && options.git) {
            grunt.log.debug(file + " # GIT and MD5 sums");

            async.parallel([  function(cb) { getMD5Sum(file,cb); },
                              function(cb) { getGitRevID(file,cb); } ], 
              function(err, data){
                grunt.log.debug(file + " # GIT and MD5 sums", data);
                callback(null,data);
              }
            )
          } else if(options.md5) {
            getMD5Sum(file,callback);
          } else if(options.git) {
            getGitRevID(file,callback);
          }

        }, function(err,results){
            console.log("results",results);

            if( err ) {
              console.log('A file failed to process');
              done(false);
            } else {

              console.log('All files have been processed successfully');
              done();
            }
        });



    });
  });

};
