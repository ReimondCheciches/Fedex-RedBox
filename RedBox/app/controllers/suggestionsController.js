(function () {
    var myApp = angular.module('myApp');

    myApp.controller('suggestionsController', ['$scope', '$location', 'suggestionService', function ($scope, $location, suggestionService) {

        var controller = this;
        controller.loadSuggestions = function () {
            suggestionService.getSuggestions().then(function (suggestions) {
                suggestions = _.each(suggestions, function (suggestion) {
                    suggestion.progress = false;
                });
                $scope.suggestions = suggestions;
                $scope.allSuggestions = suggestions;
            });
        }

        var init = function (controller) {
            controller.loadSuggestions();
        };
        init(controller);

        $scope.submitSuggestion = function (suggestion) {
            suggestionService.submitSuggestion(suggestion).then(function () {
                controller.loadSuggestions();
            });
        }

        $scope.vote = function (suggestion, upVote) {
            suggestionService.vote(suggestion.id, upVote).then(function () {
                suggestion.progress = true;
                controller.loadSuggestions();
            });
        }

        $scope.archiveSuggestion = function (id) {
            suggestionService.archiveSuggestion(id).then(function () {
                controller.loadSuggestions();
            });
        }

        $scope.showSuggestionsForCurrentWeek = function () {
            suggestionService.getSuggestionForCurrentWeek().then(function (suggestions) {
                $scope.suggestions = suggestions;
            });
        }

        $scope.showSuggestionsForCurrentMonth = function () {
            suggestionService.getSuggestionForCurrentMonth().then(function (suggestions) {
                $scope.suggestions = suggestions;
            });
        }

        $scope.orderNewest = function () {
            $scope.suggestions = _.sortBy($scope.allSuggestions, 'date');
            $scope.suggestions = $scope.suggestions.reverse();
        }

        $scope.orderHotest = function () {
            $scope.suggestions = _.sortBy($scope.allSuggestions, function (item) { return item.upVote - item.downVote; });
            $scope.suggestions = $scope.suggestions.reverse();
        }

        $scope.showArchived = function () {

            $scope.suggestions = _.filter($scope.allSuggestions, function (item) { return item.archived === true; });
        }

        $scope.showAll = function () {
            $scope.suggestions = $scope.allSuggestions;
        }
    }]);
}());