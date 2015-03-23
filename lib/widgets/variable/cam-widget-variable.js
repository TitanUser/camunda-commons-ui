define([
  'angular',
  'text!./cam-widget-variable.html',
  'text!./cam-widget-variable-dialog.html'
], function(
  angular,
  template,
  templateDialog
) {
  'use strict';

  var variableTypes = {

  };

  var modalCtrl = [
    '$scope',
    'variable',
  function (
    $dialogScope,
    variable
  ) {
    $dialogScope.ok = function () {}
  }];

  return [
    '$modal',
  function(
    $modal
  ) {
    return {
      template: template,

      scope: {
        variable: '='
      },

      controller: [
        '$scope',
      function (
        $scope
      ) {
        $scope.editVariableValue = function () {
          $modal.open({
            template: templateDialog,

            resolve: {
              variable: function () { return $scope.variable; }
            }
          });
        };
      }]
    };
  }];
});
