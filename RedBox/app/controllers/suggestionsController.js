(function () {
    var myApp = angular.module('myApp');

    myApp.controller('suggestionsController', ['$scope', '$location', 'suggestionService', function ($scope, $location, suggestionService) {
        (function init() {

        })();

        $scope.submitSuggestion = function (suggestion) {
            suggestionService.submitSuggestion(suggestion).then(function () {
            });
        }
    }]);
}());