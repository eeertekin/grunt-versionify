/*
 * grunt-versionify
 * https://github.com/eeertekin/grunt-versionify
 *
 * Copyright (c) 2014 Ertugrul Emre Ertekin
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path'),
    shell = require('shelljs/global');

module.exports = function(grunt) {

  var getMD5Sum = function(buf, shortVersion) {
    var md5 = require("MD5"),
        md5sum = md5(grunt.file.read(buf));
    if (shortVersion) {
      return md5sum.substr(0,6);
    }
    return md5sum;
  };

  var getGitRevID = function(filepath, shortVersion) {
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
    if(shortVersion) {
      revID = revID.substr(0,6);
    }
    return revID;
  };

  grunt.registerMultiTask('versionify', 'Version stamp for your files with GIT/MD5', function() {
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
      var newFiles = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        var directory = path.dirname(filepath),
            file = path.basename(filepath),
            fileExt = path.extname(file),
            versionID = "";

        if (options.md5) {
          versionID += getMD5Sum(filepath, true);
        }

        if (options.git) {
          versionID += getGitRevID(filepath,true);
        }
            
        var newFileName = path.basename(file,fileExt) + "." + versionID + fileExt,
            newFilePath = path.join( directory, newFileName );

        grunt.file.copy(filepath, newFilePath );
        grunt.log.ok(newFilePath + " created");

        if(options.replaceDest) {
          var replaceFile = grunt.file.read(f.dest);
          var newDestFile = replaceFile.replace(filepath, newFilePath);
          grunt.file.write(f.dest, newDestFile);
          grunt.log.writeln('Versionified files replaced in '+ f.dest);
        }

      });

    });
  });

};
