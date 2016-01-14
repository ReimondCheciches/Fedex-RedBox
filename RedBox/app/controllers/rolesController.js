(function() {
    var myApp = angular.module("myApp");

    myApp.controller('rolesController', function($scope,$http) {

        var onSuccessRequest = function (response) {
            $scope.coreValues = response.data;

        };

        var onErrorRequest = function() {
            $scope.message = "error on ajax call";
        };

        $http.get('/api/roles').then(onSuccessRequest, onErrorRequest);

    });
}());