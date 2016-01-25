(function () {
    var myApp = angular.module('myApp');

    myApp.controller('eomController', ['$scope', '$rootScope', 'eomService', 'userService', 'isAuth', function ($scope, $rootScope, eomService, userService, isAuth) {


            if (!isAuth)
                return;

        (function init(controller) {

            //load users
            userService.loadUsers().then(function (users) {
                users = _.sortBy(users, 'user.userInfo.FullName');
                $scope.users = users;
            });

            eomService.hasVoted().then(function (hasVoted) {
                $scope.hasVoted = hasVoted;;
            });

            eomService.getAllEoms().then(function (response) {
                $scope.eoms = _.sortBy(response, function (eom) {
                    return -new Date(eom.date);
                });

                console.log($scope.eoms);
            });

            eomService.getCurrentEom().then(function (response) {
                $scope.currentEom = response;
            });

            if ($rootScope.currentUser.isAdmin) {
                eomService.getCurrentNumberOfVotes().then(function (response) {
                    $scope.currentNumberOfVotes = response;
                });
            }

        })(this);

        $scope.querySearch = function (query) {
            if (!query)
                return $scope.users;

            var search = _.filter($scope.users, function (u) {
                return u.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });

            return search;
        }


        $scope.vote = function () {
            eomService.vote($scope.selectedItem.id, $scope.reason).then(function () {
                $scope.hasVoted = true;

                if ($rootScope.currentUser.isAdmin) {
                    eomService.getCurrentNumberOfVotes().then(function (response) {
                        $scope.currentNumberOfVotes = response;
                    });
                }
            });
        }

        $scope.stopVote = function () {
            eomService.stopVote().then(function () {
            });
        }

    }]);
}());