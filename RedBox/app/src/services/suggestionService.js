
(function () {
  'use strict';

  var module = angular.module('Redbox');

  module.service('suggestionService', ['$http', '$q', function ($http, $q) {
    var submitSuggestion = function (suggestionDesc) {
      var deferred = $q.defer();

      $http.post('/api/suggestion/AddSuggestion', {
        SuggestionDesc: suggestionDesc
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var vote = function (suggestionId, upVote) {
      var deferred = $q.defer();
      $http.post('/api/suggestion/Vote', {
        SuggestionId: suggestionId,
        UpVote: upVote
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var getSuggestions = function () {
      var deferred = $q.defer();
      $http.get('/api/suggestion/GetSuggestions').success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var archiveSuggestion = function (id) {
      var deferred = $q.defer();

      $http.post('/api/suggestion/ArchiveSuggestion', {
        Id: id
      }).success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };
    var getSuggestionForCurrentWeek = function () {
      var deferred = $q.defer();
      $http.get('/api/suggestion/GetSuggestionsCurrentWeek').success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    var getSuggestionForCurrentMonth = function () {
      var deferred = $q.defer();
      $http.get('/api/suggestion/GetSuggestionsCurrentMonth').success(function (response) {
        deferred.resolve(response);
      }).error(function (err) {
        deferred.reject(err);
      });

      return deferred.promise;
    };

    return {
      getSuggestions: getSuggestions,
      submitSuggestion: submitSuggestion,
      vote: vote,
      archiveSuggestion: archiveSuggestion,
      getSuggestionForCurrentWeek: getSuggestionForCurrentWeek,
      getSuggestionForCurrentMonth: getSuggestionForCurrentMonth
    };
  }]);
}());
