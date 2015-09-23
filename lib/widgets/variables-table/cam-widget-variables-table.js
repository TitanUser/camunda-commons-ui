define([
  'angular',
  'text!./cam-widget-variables-table.html',
  'text!./../variable/cam-widget-variable-dialog.html',
  './../variable/cam-variable-utils'
], function(
  angular,
  template,
  templateDialog,
  varUtils
) {
  'use strict';


  var modalCtrl = [
    '$scope',
    '$http',
    'variable',
    'readonly',
  function (
    $dialogScope,
    $http,
    variable,
    readonly
  ) {
    $dialogScope.variable = variable;
    $dialogScope.readonly = readonly;
    var original = angular.copy(variable);

    $dialogScope.hasChanged = function () {
      original.valueInfo = original.valueInfo || {};
      variable.valueInfo = variable.valueInfo || {};

      return original.value !== variable.value ||
              original.valueInfo.serializationDataFormat !== variable.valueInfo.serializationDataFormat ||
              original.valueInfo.objectTypeName !== variable.valueInfo.objectTypeName;
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
        editable:   '=?camEditable',
        headers:    '=?camHeaders',
        variables:  '=camVariables'
      },


      link: function ($scope) {
        var originals = angular.copy($scope.variables);

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

        function _getVar(v) {
          return $scope.variables[v].variable;
        }

        $scope.isEditable = function (what) {
          return $scope.editable.indexOf(what) > -1;
        };

        $scope.isNull = function (v) {
          return $scope.variables[v].variable.value === null;
        };

        $scope.setNull = function (v) {
          originals[v].variable.value = _getVar(v).value;
          _getVar(v).value = null;
        };

        $scope.setNonNull = function (v) {
          var variable = _getVar(v);
          variable.value = originals[v].variable.value || $scope.defaultValues[variable.type];
        };

        $scope.editVariableValue = function (v) {
          $modal.open({
            template: templateDialog,

            controller: modalCtrl,

            windowClass: 'cam-widget-variable-dialog',

            resolve: {
              variable: function () { return angular.copy(_getVar(v)); },
              readonly: function () { return $scope.isEditable('value'); }
            }
          })
          .result.then(function (result) {
            _getVar(v).value = result.value;
            _getVar(v).valueInfo = result.valueInfo;
          })
          ;
        };
      }
    };
  }];
});
