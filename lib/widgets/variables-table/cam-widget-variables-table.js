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

  var typeUtils = varUtils.typeUtils;

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


        function validate(info) {
          if (!info.variable.name || !info.variable.type) {
            info.valid = false;
          }

          else if (info.variable.value === null ||
                   ['String', 'Object', 'Null'].indexOf(info.variable.type) > -1) {
            info.valid = true;
          }

          else {
            info.valid = typeUtils.isType(info.variable.value, info.variable.type);
          }

          if(info.valid) {
            // save the variable in the appropriate type
            if (info.variable.type &&
                info.variable.value !== null &&
                $scope.isPrimitive(info.variable.type)) {
              var newTyped;

              if (info.variable.type !== 'Boolean') {
                newTyped = typeUtils.convertToType(info.variable.value, info.variable.type);
              }
              else {
                newTyped = info.variable.value ?
                            info.variable.value !== 'false' :
                            false;
              }

              // only change value if newType has different type, to avoid infinite recursion
              if(typeof info.variable.value !== typeof newTyped) {
                info.variable.value = newTyped;
              }
            }
          }
        }


        $scope.variables.forEach(function (info, i) {
          info.valid = true;

          var varPath = 'variables[' + i + '].variable';
          function wrapedValidate() {
            validate(info);
          }
          $scope.$watch(varPath + '.value', wrapedValidate);
          $scope.$watch(varPath + '.name', wrapedValidate);
          $scope.$watch(varPath + '.type', wrapedValidate);

          validate(info);
        });


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
            template: varUtils.templateDialog,

            controller: varUtils.modalCtrl,

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
