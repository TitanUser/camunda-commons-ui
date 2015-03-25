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

  var variableTypes = [
    'Boolean',
    'Bytes',
    'Date',
    'Double',
    'Integer',
    'Long',
    'Null',
    'Object',
    'Short',
    'String'
  ];

  var modalCtrl = [
    '$scope',
    'variable',
  function (
    $dialogScope,
    variable
  ) {
    $dialogScope.value = variable.value;

    $dialogScope.ok = function () {

    };

    $dialogScope.cancel = function () {

    };
  }];

  return [
    '$modal',
  function(
    $modal
  ) {
    return {
      template: template,

      scope: {
        variable: '=camVariable',
        display:  '@'
      },

      controller: [
        '$scope',
      function (
        $scope
      ) {
        $scope.variableTypes = angular.copy(variableTypes);

        $scope.editVariableValue = function () {
          $modal.open({
            template: templateDialog,

            controller: modalCtrl,

            resolve: {
              variable: function () { return $scope.variable; }
            }
          });
        };
      }]
    };
  }];
});
