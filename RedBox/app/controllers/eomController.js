(function () {
    var myApp = angular.module('myApp');

    myApp.controller('eomController', ['$scope', 'eomService', 'userService', function ($scope, eomService, userService) {

        (function init(controller) {

            //load users
            userService.loadUsers().then(function(users) {
                users = _.sortBy(users, 'user.userInfo.FullName');
                controller.Users = users;
            });

        })(this);

    }]);
}());