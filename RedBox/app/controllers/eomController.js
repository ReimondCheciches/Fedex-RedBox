(function () {
  var myApp = angular.module('Redbox');

  myApp.controller('eomController', ['$scope', '$rootScope',
    'eomService', 'userService', 'isAuth', '$route',
    function ($scope, $rootScope, eomService, userService, isAuth, $route) {
      if (!isAuth) return;

      (function init() {
        $scope.hasVoted = true;

        // load users
        userService.loadUsers().then(function (users) {
          var sortedUsers = _.sortBy(users, function (u) {
            return u.fullName;
          });
          $scope.users = sortedUsers;
        });

        eomService.hasVoted().then(function (hasVoted) {
          $scope.hasVoted = hasVoted;
        });

        eomService.getAllEoms().then(function (response) {
          $scope.eoms = _.sortBy(response, function (eom) {
            return -new Date(eom.date);
          });
        });

        eomService.getCurrentEom().then(function (response) {
          $scope.currentEom = response;
        });

        if ($rootScope.currentUser.isAdmin) {
          eomService.getCurrentNumberOfVotes().then(function (response) {
            $scope.currentNumberOfVotes = response;
          });
        }
      }(this));

      $scope.querySearch = function (query) {
        if (!query) return $scope.users;

        var search = _.filter($scope.users, function (u) {
          return u.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });

        return _.sortBy(search, function (u) {
          return u.fullName;
        });
      };


      $scope.vote = function () {
        eomService.vote($scope.selectedItem.id, $scope.reason).then(function () {
          $scope.hasVoted = true;

          if ($rootScope.currentUser.isAdmin) {
            eomService.getCurrentNumberOfVotes().then(function (response) {
              $scope.currentNumberOfVotes = response;
            });
          }
        });
      };

      $scope.stopVote = function () {
        $scope.disableStopVote = true;
        eomService.stopVote().then(function () {
          $route.reload();
        });
      };
    }
  ]);
}());
