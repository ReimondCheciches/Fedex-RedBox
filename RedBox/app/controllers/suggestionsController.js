(function () {
    var myApp = angular.module('myApp');

    myApp.controller('suggestionsController', ['$scope', '$location', 'suggestionService', function ($scope, $location, suggestionService) {

        var controller = this;
        controller.loadSuggestions = function () {
            suggestionService.getSuggestions().then(function (suggestions) {
                $scope.suggestions = suggestions;
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

        $scope.vote = function (suggestionId, upVote) {
            suggestionService.vote(suggestionId, upVote).then(function () {
                controller.loadSuggestions();
            });
        }
    }]);
}());