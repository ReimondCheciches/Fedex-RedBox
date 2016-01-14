(function () {
    var myApp = angular.module('myApp');

    myApp.controller('mainController', function ($scope, $location, authService, $http) {

        $scope.logOut = function () {
            authService.logOut();
            $location.path('/Login');
            $location.url($location.path());
        };

        $scope.isLogged = function () {

            if (authService.authentification.userName != "") {
                $scope.currentUser = authService.authentification;
                return true;
            }

       
            return false;
        };

         if (authService.authentification.userName != "") {
             $http.get('api/User/NeedsPasswordReset?userName=' + authService.authentification.userName).success(function (isResetNeeded) {
                if (isResetNeeded) {
                    $scope.logOut();
                }
        }); };


        if (!$scope.isLogged() && $location.path() !== '/Login') {
            $location.path('/Login');
            $location.url($location.path());
        } else {
            $http.get('api/Roles/GetCoachFlag?userName=' + authService.authentification.userName).success(function (response) {
                authService.authentification.isCoach = response;
            });
        }

        var tabToUrlMapping = {
            "SelfEvaluation": ["/"],
            "MyEvaluation": ["/MyEvaluation", "/MyEvaluationDetail"],
            "Feedback": ["/Feedback", "/GiveFeedback"],
            "Apprentice": ["/Apprentice", "/ApprenticeDetail"]
        };

        $scope.isTabActive = function(tabName) {

            var tab = tabToUrlMapping[tabName];

            if (!tab)
                return false;

            return _.find(tab, function(t) {
                return t === $location.path();
            });

        };

    });
}());