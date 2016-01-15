(function () {
    var myApp = angular.module('myApp');


    myApp.controller('apprenticeController', ['$scope', '$http', 'authService', '_', 'toastr', '$location', function ($scope, $http, authService, _, toastr, $location) {

        $http.get('/api/Apprentice/GetFeedbackToApprentices').success(function (response) {
            $scope.feedbacks = response;
        }).error(function (response) {
            $scope.onError = true;
            $scope.errorMessage = response.message;
        });

        $http.get('/api/Apprentice/GetCurrentEOM').success(function (response) {
            $scope.evaluationPeriod = response;
        });

        $scope.isEvaluationEnabled = function(status) {
            
            if (status === 'Submitted' || status === 'Archived') {
                return true;
            } else {
                return false;
            }

        };

    }]);
}());