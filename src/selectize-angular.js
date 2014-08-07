'use strict';

angular.module('selectize-angular', [])
  .directive('selectize', function () {
    return {
      restrict: 'A',
      require: '?ngModel',
      transclude: true,
      scope: {
        seloptions: '=',
        ngModel: '=',
        render: '='
      },
      link: function postLink(scope, element, attrs, ngModel) {
        var settings = scope.$eval(attrs.selectize);
        if (scope.render !== undefined && scope.render !== null) {
          settings.render = scope.render;
        }
        settings.delimiter = ',';

        // author: Alex Vanston
        // source: https://coderwall.com/p/ngisma
        var safeApply = function ($scope, fn) {
          var phase = $scope.$root.$$phase;
          if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof (fn) === 'function')) {
              fn();
          }
          } else {
            $scope.$apply(fn);
          }
        };

        var selectizeobj = element.selectize(settings)[0].selectize;

        var onChange = function(value) {
          safeApply(scope, function() {
            scope.ngModel = value.split(',');
          });
        };

        scope.$watch('seloptions', function() {
          safeApply(scope, function() {
            selectizeobj.clearOptions();
            for (var i in scope.seloptions)
              selectizeobj.addOption(scope.seloptions[i]);
            selectizeobj.refreshOptions(false);
          });
        });

        scope.$watch('ngModel', function(newValue, oldValue) {
          safeApply(scope, function() {
            // remove change listener before updating to prevent endless loop
            selectizeobj.off('change');
            selectizeobj.setValue(newValue);
            selectizeobj.on('change', onChange);
          });
        });
      }
    };
  });
