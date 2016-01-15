(function() {
    'use strict';

    var myApp = angular.module('myApp');

    myApp.service('eomService', ['$http', '$q', function ($http, $q) {

        var vote = function (userId, reason) {
            var deferred = $q.defer();

            $http.post('/api/eom/addVote', {userId : userId, reason : reason}).success(function () {
                deferred.resolve();
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var hasVoted = function() {
            var deferred = $q.defer();

            $http.get('/api/eom/hasVoted').success(function(response) {
                deferred.resolve(response);
            }).error(function(err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        var getCurrentNumberOfVotes = function () {
            var deferred = $q.defer();

            $http.get('/api/eom/getNumberOfCurrentEOMVotes').success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        var getAllEoms = function() {
            var deferred = $q.defer();

            $http.get('/api/eom/GetAllEOMs').success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        var getCurrentEom = function() {
            var deferred = $q.defer();

            $http.get('/api/eom/GetCurrentEOM').success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        }


        var stopVote = function() {
            var deferred = $q.defer();

            $http.get('/api/eom/endVote').success(function (response) {
                deferred.resolve(response);
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

        return {
            vote: vote,
            hasVoted: hasVoted,
            getAllEoms: getAllEoms,
            getCurrentEom: getCurrentEom,
            stopVote: stopVote,
            getCurrentNumberOfVotes: getCurrentNumberOfVotes
        }

    }]);

}());