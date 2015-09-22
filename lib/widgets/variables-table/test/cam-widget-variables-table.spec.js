/* jshint node: true, unused: false */
/* global __dirname: false, xdescribe: false, describe: false, before: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false, xit: false,
          describe: false, after: false */
'use strict';
var path = require('path');
var projectRoot = path.resolve(__dirname, '../../../../');
var pkg = require(path.join(projectRoot, 'package.json'));
var pageUrl = 'http://localhost:' + pkg.gruntConfig.connectPort +
              '/lib/widgets/variables-table/test/cam-widget-variables-table.spec.html';

var page = require('./cam-widget-variables-table.page.js');

describe('Variables Table', function() {
});
