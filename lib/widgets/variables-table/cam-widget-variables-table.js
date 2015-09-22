define([
  'angular',
  'text!./cam-widget-variables-table.html',
  './../variable/cam-variable-utils'
], function(
  angular,
  template,
  varUtils
) {
  'use strict';

  return [
  function(
  ) {
    return {
      template: template,

      scope: {
        editable:   '=?camEditable',
        headers:    '=?camHeaders',
        variables:  '=camVariables'
      },


      link: function ($scope) {
        $scope.editable = ($scope.editable || ['type', 'name', 'value']);

        $scope.headers = ($scope.headers || {
          type:   'Type',
          name:   'Name',
          value:  'Value'
        });
        $scope.headerNames = Object.keys($scope.headers);

        $scope.variableTypes = angular.copy(varUtils.types);
        $scope.defaultValues = varUtils.defaultValues;
        $scope.isPrimitive = varUtils.isPrimitive($scope);
        $scope.useCheckbox = varUtils.useCheckbox($scope);

        $scope.setNull = function (v) {
          $scope.variables[v].variable.value = null;
        };
      }
    };
  }];
});
