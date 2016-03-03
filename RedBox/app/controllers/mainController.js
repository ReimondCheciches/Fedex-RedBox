(function iife() {
  var myApp = angular.module('Redbox');

  myApp.controller('mainController', ['$scope', '$rootScope', '$location',
    'authService', 'eomService', 'toastr',
    function mainController($scope, $rootScope, $location, authService, eomService, toastr) {
      var tabToUrlMapping = {
        Suggestions: ['/', 'Suggestions'],
        EOM: ['/EOM'],
        Events: ['/Events']
      };

      $scope.isLoaded = false;

      $scope.isTabActive = function (tabName) {
        var tab = tabToUrlMapping[tabName];

        if (!tab) return false;

        return _.find(tab, function (t) {
          return t === $location.path();
        });
      };

      $rootScope.isLogged = function () {
        if (authService.authentification.fullName) {
          $rootScope.currentUser = authService.authentification;
          return true;
        }

        return false;
      };

      $scope.logOut = function () {
        authService.logOut();
      };


      if (authService.authentification.fullName) {
        eomService.hasVoted().then(function (hasVoted) {
          if (!hasVoted) {
            toastr.info('Please take your time to vote for EOM', null, {
              onTap: function () {
                $location.path('/EOM');
              },
              timeOut: 7000,
              iconClass: 'toast-blue'
            });
          }
        });
      }


      $scope.isLoaded = true;
    }
  ]);
}());
