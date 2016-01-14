(function() {
    var myApp = angular.module('myApp');

    myApp.controller('myEvaluationDetailController', [
        '$scope',
        '$http', 'evaluationItemFactory', 'authService', '_', 'toastr', '$location',
        function($scope, $http, evaluationItemFactory, authService, _, toastr, $location) {

            var initializeItems = function (items) {

                _.each(items, function(item) {
                    var evaluationItem = evaluationItemFactory.create();
                    evaluationItem.init($scope.coreValues, item.coreValues, item.type);
                    var description = item.description;
                    angular.extend(item, evaluationItem);
                    item.description = description;
                });
            }

            var onCoreValuesGetSuccess = function(response) {
                $scope.coreValues = response.data; 
            }

            var onCoreValuesGetError = function() {
                $scope.error = "Couldn't fetch items";
            }

            var onEvaluationForFeedbackSuccess = function(response) {
                if (response == null) return;

                $scope.evaluatedUser = response.data.evaluatedUser;
                $scope.userName = response.data.userName;
                $scope.evaluation = response.data;
                $scope.evaluationItems = response.data.items;
                $scope.evaluationId = response.data.id;
                $scope.evaluationDescription = response.description;
                $scope.reviewers = response.data.selectedReviewers;
                $scope.coach = response.data.selectedCoach;
                $scope.evaluationStartDate = response.data.evaluationStartDate;
                $scope.applied = response.data.apply === true ? "Yes" : "No";

                //the coach doesn't have reviewer information, so we filter him using the UserId from the reviewers list
                $scope.coachAsReviewer = _.find($scope.reviewers, function(reviewer) {
                    return reviewer.id === $scope.coach.id;
                });

                $scope.reviewers = $.grep($scope.reviewers, function(item) {
                    return item.id !== $scope.coach.id;
                });

                $scope.selectedAchievements = $.grep($scope.evaluationItems, function(achievement) {
                    return achievement.type == 1;
                });

                $scope.selectedToDos = $.grep($scope.evaluationItems, function(toDo) {
                    return toDo.type == 2;
                });

                angular.forEach($scope.evaluationItems, function(item) {
                    if ($.grep(item.feedbacks, function(feed) {
                        return feed.username == authService.authentification.userName;
                    }).length > 0)
                        item.isAllowed = false;
                    else
                        item.isAllowed = true;
                });


                initializeItems($scope.selectedAchievements);
                initializeItems($scope.selectedToDos);
            }

            var onEvaluationForFeedbackError = function(response) {
                $scope.error = "Couldn't fetch items";
                $location.url('/MyEvaluation');
            }

            $http.get('/api/CoreValue/GetCoreValues').then(onCoreValuesGetSuccess, onCoreValuesGetError);

            var requestEvaluationId = $location.search()['evaluationId'];

            var url = '/api/Evaluation/GetCommitedEvaluation?evaluationId=' + requestEvaluationId;
            $http.get(url).then(onEvaluationForFeedbackSuccess, onEvaluationForFeedbackError);
        }
    ]);
}());