(function () {
    var myApp = angular.module('Redbox');

    myApp.controller('suggestionsController', ['$scope', '$location', 'suggestionService', '$q', 'isAuth',
        function ($scope, $location, suggestionService, $q, isAuth) {

            if (!isAuth)
                return;

            var allSuggestions;

            var loadSuggestions = function () {
                var deferred = $q.defer();

                if (allSuggestions) {
                    deferred.resolve();
                    return deferred.promise;
                }

                suggestionService.getSuggestions().then(function (suggestions) {

                    suggestions = _.each(suggestions, function (suggestion) {
                        suggestion.date = new Date(suggestion.date);
                    });

                    allSuggestions = suggestions;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            var init = function () {
                $scope.allTime = false;
                $scope.currentWeek = false;
                $scope.hotest = false;
                $scope.newest = true;
                $scope.archived = false;
                $scope.currentMonth = true;

                // loadSuggestions();
            };
            init();

            $scope.submitSuggestion = function (suggestion) {

                $scope.suggestionDesc = null;

                suggestionService.submitSuggestion(suggestion).then(function (suggestion) {
                    allSuggestions.push(suggestion);
                    suggestion.date = new Date(suggestion.date);

                    var offset = suggestion.date.getTimezoneOffset();

                    suggestion.date.setMinutes(suggestion.date.getMinutes() - offset);

                    filterItems();
                });
            };

            $scope.vote = function (suggestion, upVote) {

                suggestion.hasVoted = true;
                if (upVote)
                    suggestion.upVote += 1;
                else
                    suggestion.downVote += 1;
                filterItems();

                suggestionService.vote(suggestion.id, upVote).then(function () {
                });
            };

            $scope.archiveSuggestion = function (id) {


                var suggestion = _.find(allSuggestions, function (s) {
                    return s.id === id;
                });
                suggestion.archived = true;
                filterItems();

                suggestionService.archiveSuggestion(id).then(function () {
                });
            };

            $scope.showSuggestionsForCurrentWeek = function () {
                var deferred = $q.defer();

                $scope.allTime = false;
                $scope.currentWeek = true;
                $scope.currentMonth = false;

                loadSuggestions().then(function () {
                    var weekDate = new Date();
                    weekDate.setDate(weekDate.getDate() - 7);

                    var suggestions = _.filter(allSuggestions, function (s) {
                        return s.date >= weekDate && (($scope.archived && s.archived) || (!$scope.archived && !s.archived));
                    });

                    if ($scope.archived || $scope.newest) {
                        suggestions = _.sortBy(suggestions, 'date');
                        suggestions = suggestions.reverse();
                    } else if ($scope.hotest) {
                        suggestions = _.sortBy(suggestions, function (item) {
                            return -(item.upVote - item.downVote);
                        });
                    }

                    $scope.suggestions = suggestions;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            $scope.showSuggestionsForCurrentMonth = function () {
                var deferred = $q.defer();

                $scope.allTime = false;
                $scope.currentWeek = false;
                $scope.currentMonth = true;

                loadSuggestions().then(function () {
                    var monthDate = new Date();
                    monthDate.setMonth(monthDate.getMonth() - 1);

                    var suggestions = _.filter(allSuggestions, function (s) {
                        return s.date >= monthDate && (($scope.archived && s.archived) || (!$scope.archived && !s.archived));
                    });

                    if ($scope.archived || $scope.newest) {
                        suggestions = _.sortBy(suggestions, 'date');
                        suggestions = suggestions.reverse();
                    } else if ($scope.hotest) {
                        suggestions = _.sortBy(suggestions, function (item) {
                            return -(item.upVote - item.downVote);
                        });
                    }

                    $scope.suggestions = suggestions;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            $scope.showAllTime = function () {
                var deferred = $q.defer();

                $scope.allTime = true;
                $scope.currentWeek = false;
                $scope.currentMonth = false;

                loadSuggestions().then(function () {
                    var suggestions = _.filter(allSuggestions, function (s) {
                        return (($scope.archived && s.archived) || (!$scope.archived && !s.archived));
                    });

                    if ($scope.archived || $scope.newest) {
                        suggestions = _.sortBy(suggestions, 'date');
                        suggestions = suggestions.reverse();
                    } else if ($scope.hotest) {
                        suggestions = _.sortBy(suggestions, function (item) {
                            return -(item.upVote - item.downVote);
                        });
                    }

                    $scope.suggestions = suggestions;

                    deferred.resolve();
                });

                return deferred.promise;
            };

            var filterItems = function () {
                var deferred = $q.defer();

                if ($scope.currentWeek)
                    $scope.showSuggestionsForCurrentWeek().then(function () {
                        deferred.resolve();
                    });
                else if ($scope.currentMonth)
                    $scope.showSuggestionsForCurrentMonth().then(function () {
                        deferred.resolve();
                    });
                else if ($scope.allTime)
                    $scope.showAllTime().then(function () {
                        deferred.resolve();
                    });

                return deferred.promise;
            };


            $scope.orderNewest = function () {
                $scope.hotest = false;
                $scope.newest = true;
                $scope.archived = false;

                filterItems().then(function () {
                    var suggestions = _.sortBy($scope.suggestions, 'date');
                    $scope.suggestions = suggestions.reverse();
                });


            };

            $scope.orderHotest = function () {
                $scope.hotest = true;
                $scope.newest = false;
                $scope.archived = false;

                filterItems().then(function () {
                    $scope.suggestions = _.sortBy($scope.suggestions, function (item) {
                        return -(item.upVote - item.downVote);
                    });
                });
            };

            $scope.showArchived = function () {
                $scope.hotest = false;
                $scope.newest = false;
                $scope.archived = true;

                filterItems();
            };


            $scope.orderNewest();

        }]);
}());
