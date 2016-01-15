(function() {
    'use strict';

    var myApp = angular.module('myApp');

    myApp.service('eomService', ['$http', '$q', function ($http, $q) {

        var vote = function() {
            var deferred = $q.defer();

            $http.post('/api/eom/addVote').success(function () {
                deferred.resolve(users);
            }).error(function (err, status) {
                deferred.reject(err);
            });

            return deferred.promise;
        };

        return {
            vote : vote
        }

    }]);

}());