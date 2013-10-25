'use strict';

angular.module('selectize-angular')
  .directive('selectize', function ($timeout) {
    return {
      restrict: 'A',
      require: '?ngModel',
      scope: {
        seloptions: '=seloptions',
        ngModel: '=',
      },
      link: function postLink(scope, element, attrs, ngModel) {
        var settings = scope.$eval(attrs.selectize);
        settings.delimiter = ',';

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
        }

        scope.$watch('seloptions', function() {
          safeApply(scope, function() {
            selectizeobj.clearOptions();
            for (var i in scope.seloptions)
              selectizeobj.addOption(scope.seloptions[i]);
            selectizeobj.refreshOptions();
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
