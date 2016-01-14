(function () {
    var myApp = angular.module("myApp");

    myApp.controller('myEvaluationController', function ($http, $scope, $location) {

        $http.get('/api/Evaluation/GetMyEvaluation')
            .then(function (response) {
                $scope.myEvaluations = response.data;
            });

        $scope.getDetail = function (currentId) {
            //$location.
            $http.get('/api/Evaluation/GetEvaluations?evaluationId=' + currentId)
                .then(function (response) {
                if (response.data.evaluation.statusId === 1) {
                    var selectedPath = "/MyEvaluationDetail?evaluationId=" + currentId;
                    $location.url(selectedPath);
                } else {
                    var otherPath = "/MyEvaluationDetail?evaluationId=" + currentId;
                    $location.url(otherPath);
                }
            });
        } 
    });
}());