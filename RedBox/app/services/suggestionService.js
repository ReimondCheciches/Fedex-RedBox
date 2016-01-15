(function () {
    'use strict';

    var module = angular.module('myApp');

    module.service('suggestionService', ['$http', '$q',  function ($http, $q ) {

        var submitSuggestion = function (suggestionDesc) {

            var deferred = $q.defer();

            $http.post('/api/suggestion/AddSuggestion', { 'SuggestionDesc': suggestionDesc }).success(function (response) {
                deferred.resolve(response);

            }).error(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        };
        

        return {
            submitSuggestion: submitSuggestion
        };

    }]);
})();