(function () {
    var myApp = angular.module('myApp');

    myApp.controller('mainController', function ($scope, $rootScope, $location, authService, $http) {

        $scope.isLoaded = false;

        var tabToUrlMapping = {
            "Suggestions": ["/", "Suggestions"],
            "EOM": ["/EOM"],
            "Events": ["/Events"]
        };

        $scope.isTabActive = function(tabName) {

            var tab = tabToUrlMapping[tabName];

            if (!tab)
                return false;

            return _.find(tab, function(t) {
                return t === $location.path();
            });

        };

        $scope.isLogged = function () {

            if (authService.authentification.fullName) {
                $rootScope.currentUser = authService.authentification;
                return true;
            }

            return false;
        };

        $scope.logOut = function () {
            authService.logOut();
        };




        $scope.isLoaded = true;
    });


}());