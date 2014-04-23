/*
 * grunt-versionify
 * https://github.com/eeertekin/grunt-versionify
 *
 * Copyright (c) 2014 Ertugrul Emre Ertekin
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    async = require('async'),
    crypto = require('crypto'),
    fs = require('fs');


module.exports = function(grunt) {
  var taskCount;
  
  var doneTask = function(cb) {
    if(!--taskCount) cb();
  };

  var createVersionFile = function(fileMeta, cb) {

    var filepath = Object.keys(fileMeta)[0],
      directory = path.dirname(filepath),
      file = path.basename(filepath),
      fileExt = path.extname(file),
      versionStamp = [];
  
    if(fileMeta[filepath]['gitsum']) {
      versionStamp.push(fileMeta[filepath]['gitsum'].substr(0,6));
    }

    if(fileMeta[filepath]['md5sum']) {
      versionStamp.push(fileMeta[filepath]['md5sum'].substr(0,6));
    }
    versionStamp = versionStamp.join(".");
        
    var newFileName = path.basename(file,fileExt) + "." + versionStamp + fileExt,
        newFilePath = path.join( directory, newFileName );

    grunt.file.copy(filepath, newFilePath );
    var status = newFilePath + " created";

    if(fileMeta.dest) {
        var replaceFile = grunt.file.read(fileMeta.dest);
        var newDestFile = replaceFile.replace(filepath, newFilePath);
        grunt.file.write(fileMeta.dest, newDestFile);
        status += ", "+ fileMeta.dest + " updated"
    }
    grunt.log.ok(status);

    cb(null);
  };

  var getMD5Sum = function(filepath, cb) {
    var md5 = crypto.createHash('md5');

    var s = fs.ReadStream(filepath);
    s.on('data', function(d) {
      md5.update(d);
    });

    s.on('end', function() {
      var md5sum = md5.digest('hex');
      cb(null,md5sum)
    });
  };


  var getGitRevID = function(filepath, cb) {
    var exec = require('child_process').exec;

    var child = exec('git ls-tree HEAD '+ filepath,
      function (err, output, stderr) {

        if(stderr && ( stderr.indexOf('command not found') !== -1) ) {
          grunt.fail.warn('This feature requires git');
        } 
        else if(stderr && stderr.indexOf('Not a git repository') !== -1) {
          grunt.fail.warn(filepath +' is not in a git repository');
        } 
        else {
          var gitRevID = output.split("\t")[0].split(" ")[2];
          cb(err,gitRevID);
        }
      }
    );
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
    
    taskCount = this.files.length;

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

            async.parallel({  md5sum : function(cb) { getMD5Sum(file,cb); },
                              gitsum : function(cb) { getGitRevID(file,cb); } }, 
              function(err, data){
                grunt.log.debug(file + " # GIT and MD5 sums", data);
                var val = {};
                val[file] = data;
                callback(null,val);
              }
            )
          } else if(options.md5) {
            grunt.log.debug(file + " # MD5 only");
            getMD5Sum(file,function(err,data){
              var val = {};
              val[file] = {md5sum : data};
              callback(err,val);
            });
          } else if(options.git) {
            grunt.log.debug(file + " # GIT only");
            getGitRevID(file,function(err,data){
              var val = {};
              val[file] = {gitsum : data};
              callback(err,val);
            });
          }
        }, function(err,filesMeta){
            if( err ) {
              console.log(err);
              done(false);
            } else {
              async.each(filesMeta, function(file,cb){
                  if(options.replaceDest) {
                    file.dest = f.dest 
                  }
                  createVersionFile(file, cb);
                },
                function(err){
                  if (err) grunt.fail.warn("Fatal error ", err);
                  doneTask(done);
                }
              )
            }
        });
    });
  });
};