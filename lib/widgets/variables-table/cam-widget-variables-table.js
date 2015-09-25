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

  var emptyVariable = {
    variable: {
      name: null,
      type: null,
      value: null,
      valueInfo: {}
    },
    additions: {}
  };

  return [
    '$modal',
  function(
    $modal
  ) {
    return {
      template: template,

      scope: {
        variables:  '=camVariables',
        headers:    '=?camHeaders',
        editable:   '=?camEditable'
      },


      link: function ($scope) {
        var originals = [];

        function _getVar(v) {
          return $scope.variables[v].variable;
        }
        function _getOriginal(v) {
          return (originals[v] || angular.copy(emptyVariable));
        }
        function hasChanged(v) {
          var yep;
          var now = _getVar(v);
          var before = _getOriginal(v);

          yep = !now || !before;

          yep = yep || (now.name !== before.variable.name);
          yep = yep || (now.type !== before.variable.type);
          yep = yep || (now.value !== before.variable.value);
          if (now.valueInfo) {

          }
          yep = yep || (now.valueInfo !== before.variable.valueInfo);

          return yep;
        }


        $scope.editable = ($scope.editable || ['type', 'name', 'value']);

        $scope.headers = ($scope.headers || {
          name:   'Name',
          type:   'Type',
          value:  'Value'
        });
        $scope.headerNames = Object.keys($scope.headers);

        $scope.variableTypes = angular.copy(varUtils.types);
        $scope.defaultValues = varUtils.defaultValues;
        $scope.isPrimitive = varUtils.isPrimitive($scope);
        $scope.useCheckbox = varUtils.useCheckbox($scope);


        function validate(info, i) {
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

          info.changed = hasChanged(i);
        }

        function initVariables() {
          originals = angular.copy($scope.variables || []);
          ($scope.variables || []).forEach(function (info, i) {
            info.valid = true;

            var varPath = 'variables[' + i + '].variable';
            function wrapedValidate() {
              validate(info, i);
            }
            $scope.$watch(varPath + '.value', wrapedValidate);
            $scope.$watch(varPath + '.name', wrapedValidate);
            $scope.$watch(varPath + '.type', wrapedValidate);

            validate(info, i);
          });
        }
        $scope.$watch('variables', initVariables);
        initVariables();

        $scope.headers = ($scope.headers || {
          name:   'Name',
          type:   'Type',
          value:  'Value'
        });

        $scope.headerNames = Object.keys($scope.headers);

        $scope.isEditable = function (what, info) {
          return info.editMode && $scope.editable.indexOf(what) > -1;
        };

        $scope.rowClasses = function (info/*, v*/) {
          return [
            info.editing ? null : 'editing',
            info.valid ? null : 'ng-invalid',
            info.valid ? null : 'ng-invalid-cam-variable-validator'
          ];
        };

        $scope.colClasses = function (info, headerName/*, v*/) {
          return [
            $scope.isEditable(headerName, info) ? 'editable' : null,
            'type-' + (info.variable.type || '').toLowerCase(),
            'col-' + headerName
          ];
        };





        $scope.isNull = function (v) {
          return $scope.variables[v].variable.value === null;
        };

        $scope.setNull = function (v) {
          _getOriginal(v).variable.value = _getVar(v).value;
          _getVar(v).value = null;
        };

        $scope.setNonNull = function (v) {
          var variable = _getVar(v);
          variable.value = _getOriginal(v).variable.value || $scope.defaultValues[variable.type];
        };



        $scope.editVariableValue = function (v) {
          $modal.open({
            template: varUtils.templateDialog,

            controller: varUtils.modalCtrl,

            windowClass: 'cam-widget-variable-dialog',

            resolve: {
              variable: function () { return angular.copy(_getVar(v)); },
              readonly: function () { return !$scope.isEditable('value'); }
            }
          })
          .result.then(function (result) {
            _getVar(v).value = result.value;
            _getVar(v).valueInfo = result.valueInfo;
          })
          ;
        };


        $scope.addVariable = function () {
          $scope.variables.push(angular.copy(emptyVariable));
        };

        $scope.revertVariable = function (v) {
          var original = _getOriginal(v);
          $scope.variables[v].variable = original.variable;
          $scope.variables[v].editMode = false;
        };

        // $scope.removeVariable = function (v) {
        //   //
        // };
      }
    };
  }];
});
