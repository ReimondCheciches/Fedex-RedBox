(function () {
    var myApp = angular.module('myApp');


    myApp.controller('giveFeedbackController', ['$scope',
        '$http', 'evaluationItemFactory', 'authService', '_', 'toastr', '$location',
        function ($scope, $http, evaluationItemFactory, authService, _, toastr, $location) {

            var initializeItems = function (items) {
                _.each(items, function (item) {
                    var evaluationItem = evaluationItemFactory.create();
                    evaluationItem.init($scope.coreValues, item.coreValues, item.type);
                    var description = item.description;
                    angular.extend(item, evaluationItem);
                    item.description = description;
                });
            }

            var onCoreValuesGetSuccess = function (response) {
                $scope.coreValues = response.data;
            }

            var onCoreValuesGetError = function (response) {
                $scope.error = "Couldn't fetch items";
            }

            var onEvaluationForFeedbackSuccess = function (response) {
                if (response == null) return;

                $scope.userName = response.data.evaluatedUser;
                $scope.evaluation = response.data;
                $scope.evaluationItems = response.data.items;
                $scope.evaluationId = response.data.id;
                $scope.evaluationDescription = response.data.description;
                $scope.currentReviewer = response.data.currentReviewer;

                if ($scope.currentReviewer.reviewerStatusId === 3)
                    $scope.isReviewed = true;
                else $scope.isReviewed = false;

                $scope.selectedAchievements = $.grep($scope.evaluationItems, function (achievement) {
                    return achievement.type === 1;
                });

                $scope.selectedToDos = $.grep($scope.evaluationItems, function (toDo) {
                    return toDo.type === 2;
                });

                angular.forEach($scope.evaluationItems, function (item) {
                    if ($.grep(item.feedbacks, function (feed) {
                        return feed.username.toLowerCase() === authService.authentification.userName.toLowerCase();
                    }).length > 0)
                        item.isAllowed = false;
                    else
                        item.isAllowed = true;
                });


                initializeItems($scope.selectedAchievements);
                initializeItems($scope.selectedToDos);
            }

            var onEvaluationForFeedbackError = function (response) {
                $location.url('/Feedback');
            }

            $http.get('/api/CoreValue/GetCoreValues').then(onCoreValuesGetSuccess, onCoreValuesGetError);

            var requestEvaluationId = $location.search()['evaluationId'];
            var currentUsername = authService.authentification.userName;
            var url = '/api/Feedback/GetEvaluationForFeedback?evaluationId=' + requestEvaluationId + '&currentUsername=' + currentUsername;

            $http.get(url).then(onEvaluationForFeedbackSuccess, onEvaluationForFeedbackError);

            //save feedback
            $scope.saveItem = function (item, feedItem, isUpdate) {

                var feedback = {
                    description: feedItem.description,
                    fullName: $scope.currentReviewer.name,
                    username: authService.authentification.userName,
                    itemId: item.id
                };

                if (isUpdate)
                    feedback.id = feedItem.id;

                $http.post('api/Feedback/SaveFeedback', feedback).success(function (response) {

                    if (isUpdate) {
                        toastr.info('feedback updated!');
                        return;
                    }

                    $scope.editedFeedback = {
                        username: response.username,
                        fullName: response.fullName,
                        description: response.description,
                        id: response.id
                    };

                    item.feedbacks.push($scope.editedFeedback);
                    toastr.info('feedback added!');
                    
                    item.isAllowed = false;


                }).error(function (response) {
                    $scope.error = response;
                });
            }

            $scope.setEditValue = function (item, itemToSave, value) {

                if (value === false && itemToSave.isEditable) {
                    $scope.saveItem(item, itemToSave, true);
                }

                if(!$scope.isReviewed)
                 itemToSave.isEditable = value;

            };

            $scope.getReadyState = function (items) {
                var state = true;
                angular.forEach(items, function (item) {
                    if (item.isAllowed)
                        state = false;
                    angular.forEach(item.feedbacks, function(feed) {
                        if (feed.description.length === 0)
                            state = false;
                    });
                });

                return state;
            };

            $scope.confirm = function (item) {

                var postItem = {
                    evaluationId: item.id,
                    username: authService.authentification.userName
                }
                $http.post('api/Feedback/ConfirmReview', postItem).success(function () {
                    $location.path('/Feedback');
                });
            };
        }]);
}());