'use strict';

angular.module('selectize-angular', [])
  .directive('selectize', function () {
    return {
      restrict: 'A',
      transclude: true,
      scope: {
        selection: '=',
        items: '=',
        render: '=',
        create: '='
      },
      link: function postLink(scope, element, attrs, ngModel) {
        var settings = scope.$eval(attrs.selectize);
        var externalUpdate = false;
        if (typeof scope.render !== 'undefined' && scope.render !== null) {
          settings.render = scope.render;
        }
        if (typeof scope.create !== 'undefined' && scope.create !== null) {
          settings.create = scope.create;
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

        var selectizeObj = element.selectize(settings)[0].selectize;

        selectizeObj.on('item_add', function(value) {
          if (externalUpdate) {
            return;
          }
          if (scope.selection === undefined || !scope.selection instanceof Array) {
            scope.selection = [];
          }
          for (var i in scope.items) {
            if (scope.items[i][selectizeObj.settings.valueField] === value) {
              scope.selection.push(scope.items[i]);
              delete scope.selection[scope.selection.length - 1].$order;
              break;
            }
          }
        });

        selectizeObj.on('item_remove', function(value) {
          for (var i in scope.selection) {
            if (scope.selection[i][selectizeObj.settings.valueField] === value) {
              scope.selection.splice(i,1);
              break;
            }
          }
        });

        scope.$watch('items', function() {
          safeApply(scope, function() {
            selectizeObj.clearOptions();
            selectizeObj.addOption(scope.items);
            selectizeObj.refreshOptions(false);
          });
        });

        scope.$watch('selection', function() {
          safeApply(scope, function() {
            externalUpdate = true;
            selectizeObj.clear();
            for (var i in scope.selection) {
              selectizeObj.addItem(scope.selection[i][selectizeObj.settings.valueField], true);
            }
            selectizeObj.refreshItems();
            externalUpdate = false;
          });
        });
      }
    };
  });
