(function () {
    var myApp = angular.module('myApp');

    myApp.controller('mainController', function ($scope, $rootScope, $location, authService, eomService, toastr) {

        $scope.isLoaded = false;

        var tabToUrlMapping = {
            "Suggestions": ["/", "Suggestions"],
            "EOM": ["/EOM"],
            "Events": ["/Events"]
        };

        $scope.isTabActive = function (tabName) {

            var tab = tabToUrlMapping[tabName];

            if (!tab)
                return false;

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

        eomService.hasVoted().then(function (hasVoted) {
            if (!hasVoted)
                toastr.info('Please take your time to vote for EOM', null, {
                    onTap : function() {
                        $location.path('/EOM');
                    },
                    timeOut: 7000,
                    iconClass: 'toast-blue'
                });
        });


        $scope.isLoaded = true;
    });


}());