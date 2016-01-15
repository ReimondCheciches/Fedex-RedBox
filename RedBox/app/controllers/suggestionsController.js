﻿(function () {
    var myApp = angular.module('myApp');

    myApp.controller('suggestionsController', ['$scope', '$location', 'suggestionService', function ($scope, $location, suggestionService) {

        var controller = this;
        controller.loadSuggestions = function () {
            suggestionService.getSuggestions().then(function (suggestions) {
                suggestions = _.each(suggestions, function (suggestion) {
                    suggestion.progress = false;
                });
                $scope.suggestions = _.filter(suggestions, function (item) { return item.archived != true; });
                $scope.allSuggestions = suggestions;
            });
        }

        var init = function (controller) {
            $scope.allTime = false;
            $scope.currentWeek = true;
            $scope.hotest = false;
            $scope.newest = true;
            $scope.archived = false;
            $scope.currentMonth = false;
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
            $scope.allTime = false;
            $scope.currentWeek = true;
            $scope.currentMonth = false;
            suggestionService.getSuggestionForCurrentWeek().then(function (suggestions) {
                $scope.suggestions = suggestions;
                if ($scope.newest)
                { $scope.orderNewest($scope.suggestions); return; }
                if ($scope.hotest)
                { $scope.orderHotest($scope.suggestions); return; }
                $scope.showArchived($scope.suggestions);
            });
        }

        $scope.showSuggestionsForCurrentMonth = function () {
            $scope.allTime = false;
            $scope.currentWeek = false;
            $scope.currentMonth = true;
            suggestionService.getSuggestionForCurrentMonth().then(function (suggestions) {
                $scope.suggestions = suggestions;
                if ($scope.newest)
                { $scope.orderNewest($scope.suggestions); return; }
                if ($scope.hotest)
                { $scope.orderHotest($scope.suggestions); return; }
                $scope.showArchived($scope.suggestions);
            });
        }

        $scope.orderNewest = function () {
            if ($scope.archived)
                $scope.suggestions = $scope.allSuggestions;
            $scope.hotest = false;
            $scope.newest = true;
            $scope.archived = false;
            $scope.suggestions = _.sortBy($scope.suggestions, 'date');
            $scope.suggestions = $scope.suggestions.reverse();
        }

        $scope.orderHotest = function () {
            if ($scope.archived)
                $scope.suggestions = $scope.allSuggestions;
            $scope.hotest = true;
            $scope.newest = false;
            $scope.archived = false;
            $scope.suggestions = _.sortBy($scope.suggestions, function (item) { return item.upVote - item.downVote; });
            $scope.suggestions = $scope.suggestions.reverse();
        }

        $scope.showArchived = function () {
            $scope.suggestions = $scope.allSuggestions;
            $scope.hotest = false;
            $scope.newest = false;
            $scope.archived = true;
            $scope.suggestions = _.filter($scope.suggestions, function (item) { return item.archived === true; });
        }

        $scope.showAllTime = function () {
            $scope.allTime = true;
            $scope.currentWeek = false;
            $scope.currentMonth = false;

            $scope.suggestions = $scope.allSuggestions;
            if ($scope.newest)
            { $scope.orderNewest($scope.suggestions); return; }
            if ($scope.hotest)
            { $scope.orderHotest($scope.suggestions); return; }
            $scope.showArchived($scope.suggestions);

        }
    }]);
}());