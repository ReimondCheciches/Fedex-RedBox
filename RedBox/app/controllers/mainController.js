(function () {
    var myApp = angular.module('myApp');

    myApp.controller('mainController', function ($scope, $location) {
        var tabToUrlMapping = {
            "Suggestions": ["/", "Suggestions"],
            "EOM": ["/EOM"]
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