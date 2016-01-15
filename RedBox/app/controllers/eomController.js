(function () {
    var myApp = angular.module('myApp');

    myApp.controller('eomController', ['$scope', 'eomService', 'userService', function ($scope, eomService, userService) {

        (function init(controller) {

            //load users
            userService.loadUsers().then(function (users) {
                users = _.sortBy(users, 'user.userInfo.FullName');
                $scope.users = users;
            });

        })(this);

        $scope.querySearch = function (query) {
            if (!query)
                return $scope.users;

            var search = _.filter($scope.users, function(u) {
                return u.fullName.toLowerCase().indexOf(query.toLowerCase()) !== -1;
            });

            return search;
        }

        
        $scope.vote = function () {
            eomService.vote($scope.selectedItem.id, $scope.reason).then(function() {
                
            });
             
        }

    }]);
}());