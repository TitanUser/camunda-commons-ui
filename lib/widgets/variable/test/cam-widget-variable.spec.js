/* jshint node: true, unused: false */
/* global __dirname: false, describe: false, beforeEach: false, it: false, browser: false,
          element: false, expect: false, by: false, protractor: false */
'use strict';
var path = require('path');
var projectRoot = path.resolve(__dirname, '../../../../');
var once = require(path.join(projectRoot, 'test/utils')).once;
var pkg = require(path.join(projectRoot, 'package.json'));
var pageUrl = 'http://localhost:' + pkg.gruntConfig.connectPort + '/lib/widgets/variable/test/cam-widget-variable.spec.html';

var page = require('./cam-widget-variable.page.js');

describe('Header', function() {
  var variable;
  describe('With content', function() {
    beforeEach(once(function () {
      browser.get(pageUrl + '#with-content');
      variable = page.variable('#with-content');
    }));

    it('uses the ng-transclude feature', function () {
      expect(variable.transcludedText()).toBe('Awesome');
    });
  });


  describe('Anonymous', function() {
    beforeEach(once(function () {
      browser.get(pageUrl + '#anonymous');
      variable = page.variable('#anonymous');
    }));

    it('does not show the account dropdown', function () {
      expect(variable.account().isPresent()).toBe(false);
    });

    it('does not show the link to the current app', function () {
      expect(variable.adminLink().isPresent()).toBe(false);
    });

    it('shows the links to other apps', function () {
      expect(variable.cockpitLink().isPresent()).toBe(true);
      expect(variable.tasklistLink().isPresent()).toBe(true);
    });
  });


  describe('Authenticated', function() {
    beforeEach(once(function () {
      browser.get(pageUrl + '#authenticated');
      variable = page.variable('#authenticated');
    }));

    it('shows the account dropdown', function () {
      expect(variable.account().isPresent()).toBe(true);
    });

    it('shows the user name', function () {
      expect(variable.accountText()).toBe('mustermann');
    });

    it('shows the link to admin app', function () {
      expect(variable.adminLink().isPresent()).toBe(true);
    });

    it('does not show the link to cockpit app because user has not access to it', function () {
      expect(variable.cockpitLink().isPresent()).toBe(false);
    });

    it('does not show the link to tasklist app because it is the current app', function () {
      expect(variable.tasklistLink().isPresent()).toBe(false);
    });
  });
});
