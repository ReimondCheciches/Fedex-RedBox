﻿(function () {
    var myApp = angular.module('myApp');

    myApp.controller('mainController', function ($scope, $location, authService, $http) {
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

            if (authService.authentification.userName != "") {
                $scope.currentUser = authService.authentification;
                console.log('isLogged');
                return true;
            }

       console.log('isNot');
            return false;
         };

         $scope.logOut = function () {
             authService.logOut();
         };

       

    });

   
}());