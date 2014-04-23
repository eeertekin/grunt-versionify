# grunt-versionify

> Version stamp for your files with GIT/MD5

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-versionify --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-versionify');
```

## The "versionify" task

### Overview
In your project's Gruntfile, add a section named `versionify` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  versionify: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.md5
Type: `Boolean`
Default value: `true`

Use first 6 chars of file's md5 sum (e.g. 24eee5)

#### options.git
Type: `Boolean`
Default value: `false`

Use first 6 chars of file's git revision (e.g. b78524)

#### options.replaceDest
Type: `Boolean`
Default value: `false`

Replace old filepaths with new versionified ones

It's very useful to automate the changes when versionified files are called in another file.

### Usage Examples

#### Default Options
In this example, the default options are used to do stamp the files with md5sum. New versionified files will be generated such as js/my.script.min.{md5sum}.js and 'css/my.styles.min.{md5sum}.css'

```js
grunt.initConfig({
  versionify: {
    options: {},
    files: {
      'index.php': ['js/my.script.min.js','css/my.styles.min.css']
    },
  },
});
```

#### Other Options
In this example, the default options are used to do stamp the files with md5sum and git revision ID. New versionified files will be generated such as _'js/my.script.min.{md5sum}{gitRevID}.js'_ and _'css/my.styles.min.{md5sum}{gitRevID}.css'_. 

Old filenames in 'index.php' will be replaced with new ones ;
  '_my.script.min.js_' => '**js/my.script.min.{md5sum}{gitRevID}.js**'  
  '_my.styles.min.css_' => '**css/my.styles.min.{md5sum}{gitRevID}.css**'

```js
grunt.initConfig({
  versionify: {
    options: {
      git : true,
      md5 : true,
      replaceDest : true
    },
    files: {
      'index.php': ['my.script.min.js','my.styles.min.css']
    },
  },
});
```

Task submitted by [Ertugrul Emre Ertekin](http://github.com/eeertekin)

## Release History
* 2014-04-22   v0.1.0   First Release with Git, MD5 and destination replace features
* 2014-04-22   v0.1.3   Rewritten with async.js. Native crypto module used on MD5
* 2014-04-22   v0.1.4   Status messages updated
* 2014-04-23   v0.1.5   shelljs dependency replaced with native child_process.
