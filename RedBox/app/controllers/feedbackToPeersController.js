(function () {
    var myApp = angular.module('myApp');


    myApp.controller('feedbackToPeersController', ['$scope', '$http',  'authService', '_', 'toastr', '$location', function ($scope, $http, authService, _, toastr, $location) {

        $http.get('/api/Feedback/GetFeedbackToPearsList').success(function (response) {
            $scope.feedbacks = response;
        });

        $http.get('/api/Feedback/GetReviewDueDate').success(function(response) {
            $scope.dueDate = response;
        });

    }]);
}());